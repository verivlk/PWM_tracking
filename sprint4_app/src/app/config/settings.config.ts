import {Validators} from '@angular/forms';

export const SETTINGS_CONFIG = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'email',
        label: 'Change Email',
        description: 'Update your login email',
        type: 'button',
        submitText: 'Save Email',
        fields: [
          { key: 'currentPassword', label: 'Current Password', type: 'password',
            validators: [
              Validators.required,
            ]
          },
          { label: 'New Email Address', type: 'email',
            validators: [
              Validators.required,
            ]
          },
          { label: 'Confirm New Email', type: 'text',
            validators: [
              Validators.required,
            ]
          },
        ]
      },
      {
        id: 'password',
        label: 'Change Password',
        description: 'Update your password',
        type: 'button',
        submitText: 'Save Password',
        fields: [
          { key: 'currentPassword', label: 'Current Password', type: 'password',
            validators: [
              Validators.required,
            ]
          },
          { key: 'newPassword', label: 'New Password', type: 'password',
            validators: [
              Validators.required,
              Validators.minLength(6)
            ]
          },
          { label: 'Confirm New Password', type: 'password',
            validators: [
              Validators.required,
            ]
          },
        ]
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    items: [
      {
        id: 'darkmode',
        label: 'Dark Mode',
        description: 'Toggle dark theme',
        type: 'toggle'
      }
    ]
  }
];
