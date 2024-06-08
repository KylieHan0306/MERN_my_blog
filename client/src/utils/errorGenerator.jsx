export default function errorGenerator(props) {
    const { errorType } = props || {};

    let error = {
        message:'Oops, the page you are looking for does not exist.',
        code: 404
    }
    if (errorType) {
        switch (errorType) {
            case 'login_required':
                error.message = 'To access this feature, please log in to your account.';
                error.code = 401;
                break;
            case 'password_reset_expired':
                error.message = 'Your session has expired. Please redo the changing password process again';
                error.code = 401;
                break;
            default:
                break;
        }
    }
    return error;
}
