from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .forms import RegisterForm
from .models import UserProfile
from .forms import ProfilePhotoForm


# REGISTER A NEW USER
def register_view(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("home")

    else:
        form = RegisterForm()

    return render(
        request,
        "accounts/register.html",
        {"form": form}
    )


# LOG IN AN EXISTING USER
def login_view(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = AuthenticationForm(
            request,
            data=request.POST
        )

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")

    else:
        form = AuthenticationForm(request)

    return render(
        request,
        "accounts/login.html",
        {"form": form}
    )


# LOG OUT THE CURRENT USER
@login_required
@require_POST
def logout_view(request):

    logout(request)

    return redirect("home")


# DISPLAY THE LOGGED-IN USER'S PROFILE

@login_required
def profile_view(request):

    profile, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    if request.method == "POST":

        form = ProfilePhotoForm(
            request.POST,
            request.FILES,
            instance=profile
        )

        if form.is_valid():
            form.save()
            return redirect("profile")

    else:
        form = ProfilePhotoForm(instance=profile)

    return render(
        request,
        "accounts/profile.html",
        {
            "profile": profile,
            "form": form
        }
    )

