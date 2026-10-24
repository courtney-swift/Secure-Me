from django.urls import path

from .views import (
    home,
    account_list,
    add_account,
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

]
