export default function Profile() {
  return (
    <div className="max-w-lg card p-6 space-y-3">
      <h2 className="text-xl font-semibold">Profile</h2>
      <input className="input" placeholder="Name" />
      <input className="input" placeholder="Email" />
      <button className="btn btn-primary">Save</button>
    </div>
  )
}
