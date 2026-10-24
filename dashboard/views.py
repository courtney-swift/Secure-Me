from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import SecurityAccount
from .forms import SecurityAccountForm


# HOMEPAGE
def home(request):

    return render(
        request,
        "dashboard/home.html"
    )


# VIEW SAVED SECURITY ACCOUNTS
@login_required
def account_list(request):

    accounts = SecurityAccount.objects.filter(
        user=request.user
    ).order_by("account_name")

    return render(
        request,
        "dashboard/account_list.html",
        {
            "accounts": accounts
        }
    )


# ADD A NEW SECURITY ACCOUNT
@login_required
def add_account(request):

    if request.method == "POST":

        form = SecurityAccountForm(request.POST)

        if form.is_valid():

            account = form.save(commit=False)

            account.user = request.user

            account.save()

            return redirect("account_list")

    else:
        form = SecurityAccountForm()

    return render(
        request,
        "dashboard/add_account.html",
        {
            "form": form
        }
    )
