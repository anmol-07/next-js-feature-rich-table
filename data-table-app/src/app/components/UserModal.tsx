import { useEffect, useState } from 'react';

interface User {
  id?: number;
  name: string;
  email: string;
  age: number | string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  onDelete: (user: User) => void;
  initialData?: User | null;
  deleteUserAction: boolean | null;
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData = null,
  deleteUserAction = null
}: UserModalProps) {
  const [form, setForm] = useState<User>({
    name: '',
    email: '',
    age: '',
  });

  //Setting initialData in form if available else initialize with empty field to create a new user
  useEffect(() => {
    if (initialData) setForm(initialData);
    else {
      setForm({ name: '', email: '', age: '' }); // Add mode — reset
    }
  }, [initialData, deleteUserAction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * 
   * @returns 
   * Function to submit form to parent
   */
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.age) {
      alert('All fields are required.');
      return;
    }
    onSave(form);
    setForm({ name: '', email: '', age: '' });
  };

  /**
   * Function if delete verification is true
   */
  const triggerDelete = () => {
    onDelete(form);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      {!deleteUserAction && (<div className="bg-white p-6 rounded w-100 space-y-4">
        <h2 className="text-xl font-bold">{initialData ? 'Edit' : 'Add'} User</h2>

        <div>
          <label htmlFor="name" className="font-semibold block mb-2 text-m font-medium text-gray-900 dark:text-white">Name</label>
          <input className="w-full border p-2" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        </div>

        <div>
          <label htmlFor="email" className="font-semibold block mb-2 text-m font-medium text-gray-900 dark:text-white">Email</label>
          <input className="w-full border p-2" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        </div>

        <div>
          <label htmlFor="age" className="font-semibold block mb-2 text-m font-medium text-gray-900 dark:text-white">Age</label>
          <input className="w-full border p-2" name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 bg-gray-300">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-1 bg-blue-600 text-white">{initialData ? 'Update' : 'Create'}</button>
        </div>

      </div>)}
      {deleteUserAction && (
        <div className="bg-white p-6 rounded w-100 space-y-4">

          <h2 className="text-xl font-bold">Are you sure you want to delete the user?</h2>
          
          <div className='flex justify-center items-center'>
            <button onClick={onClose} className="px-4 py-1 bg-gray-300 mr-4 rounded-md cursor-pointer">No</button>
            <button onClick={triggerDelete} className="px-4 py-1 bg-red-600 text-white rounded-md cursor-pointer">Yes</button>
          </div>
          
        </div>
      )}
    </div>
  );
}
