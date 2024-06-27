import '../stylesheets/Notification.css';

export const Notification = ({ message }) => {
  if (message === null) return null;

  return(
    <div className="notification">
      {message}
    </div>
  );
};

export const Error = ({ message }) => {
  if (message === null) return null;

  return(
    <div className="error">
      {message}
    </div>
  );
};