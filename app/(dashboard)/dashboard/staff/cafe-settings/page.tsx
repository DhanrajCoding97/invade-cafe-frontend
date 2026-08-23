import CafeSettingsForm from '../../components/cafe-settings/CafeSettingsForm';
import ExtensionPricingForm from '../../components/cafe-settings/ExtensionPricingForm';

export default async function CafeSettingsPage() {
  return (
    <div className='flex items-start justify-start flex-col gap-6'>
      <div>
        <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold '>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Cafe Settings
          </span>
        </h2>
        <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
          Manage your cafe's operating hours, pricing, and general settings.
        </p>
      </div>

      <CafeSettingsForm />
      <ExtensionPricingForm />
    </div>
  );
}
