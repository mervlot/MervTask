package authentication

import (
	"fmt"
	"mervtask/types"
	"slices"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// VerifyJWTRefresh validates a refresh token string and returns its claims if valid.
// - It ensures the token is signed with HMAC (HS256/HS384/HS512).
// - It validates issuer, expiration, and audience.
// - Returns *types.Refersh claims on success.
func VerifyJWTRefresh(secret string, t string) (*types.Refersh, error) {
	claims := &types.Refersh{}

	// Parse token with claims
	token, err := jwt.ParseWithClaims(t, claims, func(tok *jwt.Token) (interface{}, error) {
		// Ensure token is using an HMAC signing method, not RSA or ECDSA
		if _, ok := tok.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method: %v", tok.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// Validate issuer
	if id, _ := token.Claims.GetIssuer(); id != "MervID" {
		return nil, fmt.Errorf("invalid issuer: %s", id)
	}

	// Validate expiration
	if claims.ExpiresAt != nil && claims.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("expired token")
	}

	// Validate audience
	if aud, _ := token.Claims.GetAudience(); !slices.Contains(aud, "MervApps") {
		return nil, fmt.Errorf("invalid audience: %v", aud)
	}

	return claims, nil
}

// VerifyJWTAccess validates an access token string and returns its claims if valid.
// - Same validation flow as VerifyJWTRefresh, but works with *types.Access claims.
// - Access tokens usually have shorter lifespans than refresh tokens.
func VerifyJWTAccess(secret string, t string) (*types.Access, error) {
	claims := &types.Access{}

	// Parse token with claims
	token, err := jwt.ParseWithClaims(t, claims, func(tok *jwt.Token) (interface{}, error) {
		// Ensure token is signed with HMAC
		if _, ok := tok.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method: %v", tok.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// Validate issuer
	if id, _ := token.Claims.GetIssuer(); id != "MervID" {
		return nil, fmt.Errorf("invalid issuer: %s", id)
	}

	// Validate expiration
	if claims.ExpiresAt != nil && claims.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("expired token")
	}

	// Validate audience
	if aud, _ := token.Claims.GetAudience(); !slices.Contains(aud, "MervApps") {
		return nil, fmt.Errorf("invalid audience: %v", aud)
	}

	return claims, nil
}
