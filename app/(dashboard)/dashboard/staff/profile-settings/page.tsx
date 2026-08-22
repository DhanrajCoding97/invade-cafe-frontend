import ProfileSettingsForm from '../../components/profile-settings/ProfileSettingsForm';

function ProfileSettingsPage() {
  return (
    <div className='px-3 sm:px-5 lg:px-6 py-5 flex items-start justify-start flex-col gap-6'>
      <div>
        <h2>Profile Settings</h2>
        <p>Manage your account information and preferences</p>
      </div>
      <ProfileSettingsForm />
    </div>
  );
}

export default ProfileSettingsPage;
