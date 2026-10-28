from django import forms

from .models import SecurityAccount


class SecurityAccountForm(forms.ModelForm):

    # Temporary classification submitted by JavaScript.
    # Never contains the actual password.
    evaluated_password_strength = forms.ChoiceField(
        choices=[
            ("", "Not evaluated"),
            ("Weak", "Weak"),
            ("Medium", "Medium"),
            ("Strong", "Strong"),
        ],
        required=False,
        widget=forms.HiddenInput()
    )

    # User confirms the evaluated password
    # has been applied to the external account.
    confirm_password_applied = forms.BooleanField(
        required=False,
        label="I have applied this password to my account."
    )

    class Meta:

        model = SecurityAccount

        fields = [
            "account_name",
            "website",
            "mfa_enabled",
            "password_unique",
            "recovery_updated",
        ]

        widgets = {
            "account_name": forms.TextInput(
                attrs={"class": "form-control"}
            ),

            "website": forms.TextInput(
                attrs={"class": "form-control"}
            ),

            "mfa_enabled": forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),

            "password_unique": forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),

            "recovery_updated": forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),
        }

    def clean(self):

        cleaned_data = super().clean()

        strength = cleaned_data.get(
            "evaluated_password_strength"
        )

        confirmed = cleaned_data.get(
            "confirm_password_applied"
        )

        # A new strength classification must
        # be accompanied by user confirmation.
        if strength and not confirmed:

            self.add_error(
                "confirm_password_applied",
                "Confirm that you applied the evaluated "
                "password before saving its strength."
            )

        return cleaned_data