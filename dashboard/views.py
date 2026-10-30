from django.shortcuts import render, redirect, get_object_or_404

from django.contrib.auth.decorators import login_required

from .recommendations import generate_security_recommendations

from .models import SecurityAccount
from .forms import SecurityAccountForm


# SECUREME SECURITY DASHBOARD
@login_required
def home(request):

    # GET ACCOUNTS BELONGING TO THE LOGGED-IN USER
    accounts = SecurityAccount.objects.filter(
        user=request.user
    )

    # TOTAL NUMBER OF ACCOUNTS
    total_accounts = accounts.count()

    # MFA STATISTICS
    mfa_enabled = accounts.filter(
        mfa_enabled=True
    ).count()

    mfa_disabled = accounts.filter(
        mfa_enabled=False
    ).count()

    # SECURITY SCORE STATISTICS
    total_score = 0

    good_security = 0
    moderate_security = 0
    needs_improvement = 0

    # ACCOUNTS THAT NEED ATTENTION
    accounts_needing_attention = []

    # CALCULATE SCORES FOR EACH ACCOUNT
    for account in accounts:

        score = account.calculate_security_score()

        total_score += score

        # CLASSIFY ACCOUNT SECURITY
        if score >= 80:

            good_security += 1

        elif score >= 50:

            moderate_security += 1

        else:

            needs_improvement += 1

            accounts_needing_attention.append(account)

    # CALCULATE OVERALL SECURITY SCORE
    if total_accounts > 0:

        overall_score = round(
            total_score / total_accounts
        )

    else:

        overall_score = 0

    # DETERMINE OVERALL SECURITY LEVEL
    if total_accounts == 0:

        overall_level = "No Accounts"

    elif overall_score >= 80:

        overall_level = "Good"

    elif overall_score >= 50:

        overall_level = "Moderate"

    else:

        overall_level = "Needs Improvement"

    # SEND DATA TO HTML TEMPLATE
    context = {

        "overall_score": overall_score,

        "overall_level": overall_level,

        "total_accounts": total_accounts,

        "mfa_enabled": mfa_enabled,

        "mfa_disabled": mfa_disabled,

        "good_security": good_security,

        "moderate_security": moderate_security,

        "needs_improvement": needs_improvement,

        "accounts_needing_attention": accounts_needing_attention,
    }

    return render(
        request,
        "dashboard/home.html",
        context
    )


# DISPLAY ALL ACCOUNTS
# DISPLAY ALL ACCOUNTS WITH SECURITY SCORES
@login_required
def account_list(request):

    accounts = SecurityAccount.objects.filter(
        user=request.user
    ).order_by("account_name")

    # CALCULATE SCORE FOR EACH ACCOUNT
    for account in accounts:

        account.security_score = (
            account.calculate_security_score()
        )

        account.security_level = (
            account.get_security_level()
        )

    return render(
        request,
        "dashboard/account_list.html",
        {
            "accounts": accounts
        }
    )

    accounts = SecurityAccount.objects.filter(
        user=request.user
    ).order_by("account_name")

    return render(
        request,
        "dashboard/account_list.html",
        {"accounts": accounts}
    )


# ADD A SECURITY ACCOUNT
@login_required
def add_account(request):

    if request.method == "POST":

        form = SecurityAccountForm(request.POST)

        if form.is_valid():

            account = form.save(commit=False)

            account.user = request.user

            # Save only the classification,
            # never the actual password.
            strength = form.cleaned_data.get(
                "evaluated_password_strength"
            )

            confirmed = form.cleaned_data.get(
                "confirm_password_applied"
            )

            if strength and confirmed:

                account.password_strength = strength

            else:

                account.password_strength = "Weak"

            account.save()

            return redirect("account_list")

    else:

        form = SecurityAccountForm()

    return render(
        request,
        "dashboard/add_account.html",
        {"form": form}
    )


# ============================================
# ACCOUNT DETAILS WITH RECOMMENDATIONS
# ============================================

@login_required
def account_detail(request, account_id):

    # ========================================
    # STEP 1: RETRIEVE THE USER'S ACCOUNT
    # ========================================

    account = get_object_or_404(
        SecurityAccount,
        id=account_id,
        user=request.user
    )

    # ========================================
    # STEP 2: CALCULATE SECURITY INFORMATION
    # ========================================

    security_score = account.calculate_security_score()

    security_level = account.get_security_level()

    # ========================================
    # STEP 3: GENERATE RECOMMENDATIONS
    # ========================================

    recommendations = generate_security_recommendations(
        account
    )

    # ========================================
    # STEP 4: PREPARE TEMPLATE CONTEXT
    # ========================================

    context = {
        "account": account,
        "security_score": security_score,
        "security_level": security_level,
        "recommendations": recommendations
    }

    # ========================================
    # STEP 5: DISPLAY ACCOUNT DETAILS
    # ========================================

    return render(
        request,
        "dashboard/account_detail.html",
        context
    )


# EDIT ACCOUNT
@login_required
def edit_account(request, account_id):

    account = get_object_or_404(
        SecurityAccount,
        id=account_id,
        user=request.user
    )

    if request.method == "POST":

        form = SecurityAccountForm(
            request.POST,
            instance=account
        )

        if form.is_valid():

            updated_account = form.save(commit=False)

            strength = form.cleaned_data.get(
                "evaluated_password_strength"
            )

            confirmed = form.cleaned_data.get(
                "confirm_password_applied"
            )

            # Update strength only when
            # a new evaluation was confirmed.
            if strength and confirmed:

                updated_account.password_strength = strength

            # Otherwise, preserve the previous value.

            updated_account.save()

            return redirect(
                "account_detail",
                account_id=account.id
            )

    else:

        form = SecurityAccountForm(instance=account)

    return render(
        request,
        "dashboard/edit_account.html",
        {
            "form": form,
            "account": account,
        }
    )


# DELETE ACCOUNT
@login_required
def delete_account(request, account_id):

    account = get_object_or_404(
        SecurityAccount,
        id=account_id,
        user=request.user
    )

    if request.method == "POST":

        account.delete()

        return redirect("account_list")

    return render(
        request,
        "dashboard/delete_account.html",
        {"account": account}
    )

# PHASE 5 - PASSWORD STRENGTH CHECKER
@login_required
def password_checker(request):

    return render(
        request,
        "dashboard/password_checker.html"
    )