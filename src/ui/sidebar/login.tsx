import { Dropdown } from '@/ui/components/dropdown';

export default function Login() {
   return (
      <div className="flex flex-col gap-2 bg-gray-800 rounded-xl p-2">
         <span>Welcome!</span>
         <input
            className="bg-gray-700 rounded pl-2 pr-2"
            id="username"
            type="text"
            name="username"
            placeholder="choose a username.."
            minLength={4}
         />
         <Dropdown
            options={[
               '--Previous Usernames--',
               'option 1',
               'option 2',
               'option 3',
            ]}
            onSelect={() => undefined}
         />
      </div>
   );
}
