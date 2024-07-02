import PropTypes from 'prop-types';

export const LoginForm = ({ username, password, handlePasswordChange, handleUsernameChange, handleSubmit }) => {
  return (
    <div onSubmit={handleSubmit}>
      <h1>log in to application</h1>
      <form>
	<div>
	  username <input 
	  data-testid='username'
	  value={username} 
	  name="Username" 
	  onChange={handleUsernameChange} />
	</div>
	<div>
	  password 	  
	  <input data-testid='password'
	  type="password" 
	  value={password} 
	  name="Password" 
	  onChange={handlePasswordChange} />
	</div>
	<button>login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
