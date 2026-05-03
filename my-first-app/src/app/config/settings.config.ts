export const SETTINGS_CONFIG = [
  {
    title: 'Account',
    items: [
      {
        label: 'Change Email',
        type: 'form',
        fields: [
          { label: 'Current Email Address', required: true },
          { label: 'New Email Address', required: true },
          { label: 'Confirm New Email', required: true }
        ]
      },
      {
        label: 'Change Password',
        type: 'form',
        fields: [
          { label: 'New Password', required: true },
          { label: 'Confirm New Password', required: true }
        ]
      }
    ]
  },
  {
    title: 'Appearance',
    items: [
      {
        label: 'Dark Mode',
        type: 'toggle'
      }
    ]
  }
];
