from django.urls import path

from .views import (
    home,
    account_list,
    add_account,
    account_detail,
    edit_account,
    delete_account,
    password_checker,
)

urlpatterns = [

    path(
        "",
        home,
        name="home"
    ),

    path(
        "accounts/",
        account_list,
        name="account_list"
    ),

    path(
        "accounts/add/",
        add_account,
        name="add_account"
    ),

    path(
        "accounts/<int:account_id>/",
        account_detail,
        name="account_detail"
    ),

    path(
        "accounts/<int:account_id>/edit/",
        edit_account,
        name="edit_account"
    ),

    path(
        "accounts/<int:account_id>/delete/",
        delete_account,
        name="delete_account"
    ),

    path(
    "password-checker/",
    password_checker,
    name="password_checker"
),

]