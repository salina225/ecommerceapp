import { Auth } from 'aws-amplify';

const checkUser = async (updateUser)=> {

  try {
      const userData = await Auth.currentSession();

      console.log("checkUser", userData);

      //NESTED OBJECT DESTRUCTRING woA!!!!
      const { idToken: { payload }} = userData


      //initialize a boolean whether or not the user is in the admin group
      //
      //payload.cognito:groups "same as payload["cognito:groups"]....
      const isAuthorized = payload['cognito:groups'] && payload['cognito:groups'].includes('Admin');

      updateUser(
        {
          username: payload['cognito:username']
          , isAuthorized // JS property shorthand syntax for isAuthorized:isAuthorized
        }
    );
  }

  catch (err){
      console.error(err);
      updateUser({});
  }
}

export default checkUser;
