import { useEffect } from 'react';
import { useHistory } from 'react-router';

function LogoutScreen() {
  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userLocation");
    history.push('/');
  });

  return (
    <>
    </>
  );
}

export default LogoutScreen;
