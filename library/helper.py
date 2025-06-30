"""
objective : This function serves as documentation to help you test endpoints.

------------------------------ test APIs -----------------------------------
1 - user_registration : http://127.0.0.1:8000/api/register/

input : username , password , email as json format
like :
        {
            "username":"ahmedeltokhy",
            "email": "ahmedeltokhy@eexample.com",
            "password": "ahmedeltokhy2003"
        }

-----------------------------------------------------------------------------
2 - user_login: http://127.0.0.1:8000/api/login/

input : email and password as json format
like :
       {
            "username": "ahmedeltokhy",
            "email": "ahmedeltokhy@eexample.com"
        }
-----------------------------------------------------------------------------

3 - user_logout: http://127.0.0.1:8000/api/logout/

input : key = Authorization , value = token token_value (token 001a9fed527b2b7c1c06937878d6fca8173101b2)
"""