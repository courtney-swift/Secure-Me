from django import forms

from .models import SecurityAccount


class SecurityAccountForm(forms.ModelForm):

    class Meta:

        model = SecurityAccount

        fields = [
            "account_name",
            "website",
            "mfa_enabled",
            "password_unique",
            "password_strength",
            "recovery_updated",
        ]

        widgets = {

            "account_name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: Gmail",
                }
            ),

            "website": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: accounts.google.com",
                }
            ),

            "mfa_enabled": forms.CheckboxInput(
                attrs={
                    "class": "form-check-input",
                }
            ),

            "password_unique": forms.CheckboxInput(
                attrs={
                    "class": "form-check-input",
                }
            ),

            "password_strength": forms.Select(
                attrs={
                    "class": "form-select",
                }
            ),

            "recovery_updated": forms.CheckboxInput(
                attrs={
                    "class": "form-check-input",
                }
            ),
        }
