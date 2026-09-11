export const getAccessToken = () => {
    return (
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken')
    );
};

export const isAuthenticated = () => {
    return Boolean(getAccessToken());
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
};