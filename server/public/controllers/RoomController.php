<?php

require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../config/jwt.php';

class RoomController {

    private PDO $conn;
    private AuthController $authController;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createRoom() {

        $user = Auth::getAuthenticatedUser($this->conn);
        if (!$user) {
            Response::json([
                "error" => "Unauthorized"
            ], 401);
        }

        // =====================
        // REQUEST BODY
        // =====================
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !isset($data['quiz_id']) ||
            !isset($data['mode']) ||
            !isset($data['modifier'])
        ) {
            Response::json([
                "error" => "Missing required fields"
            ], 400);
        }

        // =====================
        // CHECK QUIZ EXISTS
        // =====================
        $stmt = $this->conn->prepare("
            SELECT id
            FROM quizzes
            WHERE id = ?
        ");

        $stmt->execute([$data['quiz_id']]);

        if (!$stmt->fetch()) {
            Response::json([
                "error" => "Quiz not found"
            ], 404);
        }

        // =====================
        // GENERATE ROOM CODE
        // =====================
        $room_code = $this->generateRoomCode();

        // =====================
        // CREATE SESSION
        // =====================
        $stmt = $this->conn->prepare("
            INSERT INTO game_sessions (
                quiz_id,
                host_id,
                room_code,
                mode,
                modifier,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'LOBBY')
        ");

        $stmt->execute([
            $data['quiz_id'],
            $user['id'] ,
            $room_code,
            $data['mode'],
            $data['modifier']
        ]);

        Response::json([
            "room_code" => $room_code,
            "host_id" => $user['id']
        ], 201);
    }

    public function checkPlayerInGameSession(int $userId,int $gameSessionId): bool {

        $stmt = $this->conn->prepare("
            SELECT 1
            FROM game_players
            WHERE session_id = ?
            AND user_id = ?
            LIMIT 1
        ");

        $stmt->execute([
            $gameSessionId,
            $userId
        ]);

        return (bool) $stmt->fetchColumn();
    }

    private function generateRoomCode(): string {

        do {

            $code = strtoupper(substr(
                bin2hex(random_bytes(4)),
                0,
                6
            ));

            $stmt = $this->conn->prepare("
                SELECT id
                FROM game_sessions
                WHERE room_code = ?
            ");

            $stmt->execute([$code]);

        } while ($stmt->fetch());

        return $code;
    }

    public function startGame($room_code) {

        $user = Auth::getAuthenticatedUser($this->conn);

        // get session
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");
        $stmt->execute([$room_code]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json(["error" => "Room not found"], 404);
        }

        // only host can start
        if ($session['host_id'] != $user['id']) {
            Response::json(["error" => "Not host"], 403);
        }

        // must be in lobby
        if ($session['status'] !== 'LOBBY') {
            Response::json(["error" => "Game already started"], 400);
        }

        // start game
        $stmt = $this->conn->prepare("
            UPDATE game_sessions
            SET status = 'PLAYING',
                started_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$session['id']]);

        Response::json([
            "message" => "Game started"
        ]);
    }

    public function getResults($room_code) {

        $user = Auth::getAuthenticatedUser($this->conn);
        if (!$user) {
            Response::json([
                "error" => "Unauthorized"
            ], 401);
        }

        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");
        $stmt->execute([$room_code]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json(["error" => "Room not found"], 404);
        }

        $stmt = $this->conn->prepare("
            SELECT
                gp.user_id,
                gp.score,
                u.username,
                u.avatar_url
            FROM game_players gp
            JOIN users u ON u.id = gp.user_id
            WHERE gp.session_id = ?
            ORDER BY gp.score DESC
        ");

        $stmt->execute([$session['id']]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json([
            "room_code" => $room_code,
            "results" => $results
        ]);
    }

    public function joinRoom() {

        $user = Auth::getAuthenticatedUser($this->conn);

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['room_code'])) {
            Response::json([
                "error" => "Missing room_code"
            ], 400);
        }

        // find session
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");

        $stmt->execute([$data['room_code']]);

        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json([
                "error" => "Room not found"
            ], 404);
        }

        // CHECK GAME STATE
        if ($session['status'] !== 'LOBBY') {
            Response::json([
                "error" => "Game already started"
            ], 403);
        }

        // already joined
        if ($this->checkPlayerInGameSession($user['id'], $session['id'])) {
            Response::json([
                "message" => "Already joined"
            ]);
        }

        // player count
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as total
            FROM game_players
            WHERE session_id = ?
        ");

        $stmt->execute([$session['id']]);

        $playersCount = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($playersCount['total'] >= $session['max_players']) {
            Response::json([
                "error" => "Room is full"
            ], 400);
        }

        // insert player
        $stmt = $this->conn->prepare("
            INSERT INTO game_players (
                session_id,
                user_id
            )
            VALUES (?, ?)
        ");

        $stmt->execute([
            $session['id'],
            $user['id']
        ]);

        Response::json([
            "message" => "Joined room successfully"
        ], 201);
    }

    public function getStatus($room_code) {

        $stmt = $this->conn->prepare("
            SELECT
                gs.id,
                gs.status,
                gs.mode,
                gs.modifier,
                gs.current_question_index,
                gs.max_players,

                (
                    SELECT COUNT(*)
                    FROM game_players gp
                    WHERE gp.session_id = gs.id
                ) as players_count

            FROM game_sessions gs
            WHERE gs.room_code = ?
        ");

        $stmt->execute([$room_code]);

        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json([
                "error" => "Room not found"
            ], 404);
        }

        Response::json($session);
    }

    public function getCurrentQuestion($room_code) {

        // session
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");

        $stmt->execute([$room_code]);

        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json([
                "error" => "Room not found"
            ], 404);
        }

        // session check
        if ($session['status'] !== 'PLAYING') {
            Response::json([
                "error" => "Game not started yet"
            ], 403);
        }

        $offset = (int)$session['current_question_index'];

        // question
        $stmt = $this->conn->prepare("
            SELECT *
            FROM questions
            WHERE quiz_id = ?
            LIMIT 1 OFFSET $offset
        ");

        $stmt->execute([
            $session['quiz_id']
        ]);

        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$question) {
            Response::json([
                "error" => "Question not found"
            ], 404);
        }

        // answers
        $stmt = $this->conn->prepare("
            SELECT
                id,
                answer_text
            FROM answers
            WHERE question_id = ?
        ");

        $stmt->execute([$question['id']]);

        $question['answers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($question);
    }

    public function submitAnswer($room_code) {

        $user = Auth::getAuthenticatedUser($this->conn);

        $data = json_decode(file_get_contents("php://input"), true);

        // session
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");
        $stmt->execute([$room_code]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json(["error" => "Room not found"], 404);
        }

        // session check
        if ($session['status'] !== 'PLAYING') {
            Response::json([
                "error" => "Game not started yet"
            ], 403);
        }

        // player
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_players
            WHERE session_id = ?
            AND user_id = ?
        ");
        $stmt->execute([$session['id'], $user['id']]);
        $player = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$player) {
            Response::json(["error" => "Not in room"], 403);
        }

        // current question
        $offset = (int) $session['current_question_index'];
        $stmt = $this->conn->prepare("
            SELECT *
            FROM questions
            WHERE quiz_id = ?
            LIMIT 1 OFFSET $offset
        ");
        $stmt->execute([
            $session['quiz_id']
        ]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$question) {
            Response::json(["error" => "No question"], 404);
        }

        // already answered?
        $stmt = $this->conn->prepare("
            SELECT id
            FROM player_answers
            WHERE session_id = ?
            AND player_id = ?
            AND question_id = ?
        ");
        $stmt->execute([
            $session['id'],
            $player['id'],
            $question['id']
        ]);

        if ($stmt->fetch()) {
            Response::json(["error" => "Already answered"], 400);
        }

        $is_correct = 0;

        // allow only null OR valid answer
        if (array_key_exists('answer_id', $data) && $data['answer_id'] !== null) {

            $stmt = $this->conn->prepare("
                SELECT is_correct
                FROM answers
                WHERE id = ?
                AND question_id = ?
                LIMIT 1
            ");

            $stmt->execute([
                $data['answer_id'],
                $question['id']
            ]);

            $answer = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$answer) {
                Response::json([
                    "error" => "Invalid answer_id"
                ], 400);
            }

            $is_correct = (int)$answer['is_correct'];
        }

        // insert answer (IMPORTANT: answer_id CAN BE NULL)
        $stmt = $this->conn->prepare("
            INSERT INTO player_answers (
                session_id,
                player_id,
                question_id,
                answer_id,
                is_correct,
                response_time_ms
            )
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $session['id'],
            $player['id'],
            $question['id'],
            $data['answer_id'] ?? null,
            $is_correct,
            $data['response_time_ms'] ?? null
        ]);

        // update score
        if ($is_correct) {
            $stmt = $this->conn->prepare("
                UPDATE game_players
                SET score = score + 100
                WHERE id = ?
            ");
            $stmt->execute([$player['id']]);
        }

        // check auto-advance
        $this->checkAutoAdvance($session['id']);

        Response::json([
            "correct" => $is_correct
        ]);
    }

    private function checkAutoAdvance($session_id) {

        // session
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE id = ?
        ");
        $stmt->execute([$session_id]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        // total players
        $stmt = $this->conn->prepare("
            SELECT COUNT(*)
            FROM game_players
            WHERE session_id = ?
        ");
        $stmt->execute([$session_id]);
        $totalPlayers = $stmt->fetchColumn();

        // answered players for current question
        $offset = (int) $session['current_question_index'];
        $stmt = $this->conn->prepare("
            SELECT COUNT(DISTINCT player_id)
            FROM player_answers
            WHERE session_id = ?
            AND question_id = (
                SELECT id
                FROM questions
                WHERE quiz_id = ?
                LIMIT 1 OFFSET $offset
            )
        ");

        $stmt->execute([
            $session_id,
            $session['quiz_id']
        ]);

        $answered = $stmt->fetchColumn();

        // ALL ANSWERED => NEXT QUESTION
        if ($answered >= $totalPlayers) {
            $this->nextQuestion($session_id);
        }
    }

    public function nextQuestion($session_id) {

        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE id = ?
        ");
        $stmt->execute([$session_id]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json(["error" => "Room not found"], 404);
        }

        // session check
        if ($session['status'] !== 'PLAYING') {
            Response::json([
                "error" => "Game not started yet"
            ], 403);
        }

        // increment index
        $nextIndex = $session['current_question_index'] + 1;

        // check max questions
        $stmt = $this->conn->prepare("
            SELECT COUNT(*)
            FROM questions
            WHERE quiz_id = ?
        ");
        $stmt->execute([$session['quiz_id']]);
        $totalQuestions = $stmt->fetchColumn();

        if ($nextIndex >= $totalQuestions) {

            $stmt = $this->conn->prepare("
                UPDATE game_sessions
                SET status = 'FINISHED'
                WHERE id = ?
            ");
            $stmt->execute([$session_id]);

            return;
        }

        // update next question
        $stmt = $this->conn->prepare("
            UPDATE game_sessions
            SET current_question_index = ?
            WHERE id = ?
        ");
        $stmt->execute([$nextIndex, $session_id]);
    }

    public function forceNextQuestion($room_code) {

        $user = Auth::getAuthenticatedUser($this->conn);

        // check host
        $stmt = $this->conn->prepare("
            SELECT *
            FROM game_sessions
            WHERE room_code = ?
        ");
        $stmt->execute([$room_code]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            Response::json(["error" => "Room not found"], 404);
        }

        // session check
        if ($session['status'] !== 'PLAYING') {
            Response::json([
                "error" => "Game not started yet"
            ], 403);
        }

        if ($session['host_id'] != $user['id']) {
            Response::json(["error" => "Not host"], 403);
        }

        $this->nextQuestion($session['id']);

        Response::json([
            "message" => "Next question started"
        ]);
    }
}