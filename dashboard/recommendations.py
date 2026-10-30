# ============================================
# SecureMe - Security Recommendation Engine
# ============================================
def generate_security_recommendations(account):
    """
    Analyze a SecurityAccount and generate
    personalized security recommendations.

    Each recommendation contains:
        - title
        - description
        - priority
        - category

    The function returns a list of dictionaries.
    """

    recommendations = []

    # ========================================
    # 1. MULTI-FACTOR AUTHENTICATION
    # ========================================

    if not account.mfa_enabled:

        recommendations.append({
            "title": "Enable Multi-Factor Authentication",

            "description": (
                "Your account does not currently have MFA "
                "enabled. If the service supports MFA, "
                "enable it to add an extra layer of security."
            ),

            "priority": "High",

            "category": "Authentication"
        })

    # ========================================
    # 2. PASSWORD STRENGTH
    # ========================================

    if account.password_strength == "Weak":

        recommendations.append({
            "title": "Improve Password Strength",

            "description": (
                "Your account has a weak recorded password "
                "strength. Consider creating a stronger "
                "password using SecureMe's password "
                "generator and applying it to the account."
            ),

            "priority": "High",

            "category": "Password Security"
        })

    elif account.password_strength == "Medium":

        recommendations.append({
            "title": "Consider a Stronger Password",

            "description": (
                "Your password has a medium recorded "
                "strength. Consider using a longer, "
                "randomly generated password."
            ),

            "priority": "Medium",

            "category": "Password Security"
        })

    # ========================================
    # 3. PASSWORD UNIQUENESS
    # ========================================

    if not account.password_unique:

        recommendations.append({
            "title": "Use a Unique Password",

            "description": (
                "Your account is not marked as using a "
                "unique password. Reusing passwords can "
                "put multiple accounts at risk if one "
                "service experiences a data breach."
            ),

            "priority": "High",

            "category": "Password Security"
        })

    # ========================================
    # 4. RECOVERY INFORMATION
    # ========================================

    if not account.recovery_updated:

        recommendations.append({
            "title": "Review Account Recovery Information",

            "description": (
                "Your account recovery information is not "
                "marked as updated. Review your recovery "
                "email, phone number, and other recovery "
                "options on the external website."
            ),

            "priority": "Medium",

            "category": "Account Recovery"
        })

    # ========================================
    # 5. ALL SECURITY CHECKS PASSED
    # ========================================

    if not recommendations:

        recommendations.append({
            "title": "Great Job! Keep Your Account Secure",

            "description": (
                "All tracked security settings currently "
                "meet SecureMe's recommendations. "
                "Continue monitoring your account for "
                "suspicious activity and security alerts."
            ),

            "priority": "Low",

            "category": "General Security"
        })

    # ========================================
    # 6. SORT RECOMMENDATIONS BY PRIORITY
    # ========================================

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    recommendations.sort(
        key=lambda recommendation: priority_order[
            recommendation["priority"]
        ]
    )

    # ========================================
    # 7. RETURN RECOMMENDATIONS
    # ========================================

    return recommendations