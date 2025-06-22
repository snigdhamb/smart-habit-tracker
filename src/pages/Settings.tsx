const Settings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Profile</h3>
        <input className="block mb-2 p-2 border w-full" placeholder="Full Name" />
        <input className="block p-2 border w-full" placeholder="Email" />
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Account</h3>
        <button className="bg-yellow-400 px-4 py-2 rounded">Change Password</button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Receive email notifications
        </label>
      </section>
    </div>
  );
};

export default Settings;