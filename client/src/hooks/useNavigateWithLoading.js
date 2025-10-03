import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const useNavigateWithLoading = () => {
  const navigate = useNavigate();
  const { showLoading } = useLoading();

  const navigateWithLoading = (path, options = {}) => {
    const { 
      message = 'Loading...', 
      delay = 300,
      ...navigateOptions 
    } = options;

    showLoading(message);
    
    setTimeout(() => {
      navigate(path, navigateOptions);
    }, delay);
  };

  return navigateWithLoading;
};

export default useNavigateWithLoading;