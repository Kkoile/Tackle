# Tackle
Tackle for mobile platform


Also Server Usage:
Wenn Nutzer noch nicht angemeldet ist HTTP-POST an /login/MeinUserName
wenn ein 200 Zurrückkommt ist das json
{token: token}
den token irgendwo speichern
Dann Socket.io connecten
Dann 'auth' emmitten und token als parameter mitschicken
mit io.on('auth', function(auth) {/* auth.success === true */ } )