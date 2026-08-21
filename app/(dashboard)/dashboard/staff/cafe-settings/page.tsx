import CafeSettingsForm from '../../components/cafe-settings/CafeSettingsForm';
import ExtensionPricingForm from '../../components/cafe-settings/ExtensionPricingForm';

export default async function CafeSettingsPage() {
  return (
    <div className='flex items-start justify-start flex-col gap-10'>
      <div>
        <h2>Cafe Settings</h2>
        <p>Manage Cafe's open hours, edit pricing.</p>
      </div>

      <CafeSettingsForm />
      <ExtensionPricingForm />
    </div>
  );
}
