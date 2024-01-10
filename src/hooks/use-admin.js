import { useContext } from 'react';
import { AdminContext } from 'src/contexts/admin-context';

export const useAdmin = () => useContext(AdminContext);
