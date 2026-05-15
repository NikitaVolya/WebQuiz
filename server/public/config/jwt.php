<?php

class JWT {
    private static string $secret = "SUPER_SECRET_KEY_CHANGE_ME";

    public static function generate($payload): string {
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode($payload));

        $signature = hash_hmac('sha256', "$header.$payload", self::$secret, true);
        $signature = base64_encode($signature);

        return "$header.$payload.$signature";
    }

    public static function validate($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            error_log("JWT DEBUG: Token n'a pas 3 parties");
            return false;
        }

        [$header, $payload, $signature] = $parts;

        $validSignature = base64_encode(
            hash_hmac('sha256', "$header.$payload", self::$secret, true)
        );

        error_log("JWT DEBUG: Signature reçue : " . $signature);
        error_log("JWT DEBUG: Signature attendue : " . $validSignature);

        if ($signature !== $validSignature) {
            error_log("JWT DEBUG: ÉCHEC DE SIGNATURE");
            return false;
        }

        error_log("JWT DEBUG: SIGNATURE VALIDE");

        return json_decode(base64_decode($payload), true);
    }
}