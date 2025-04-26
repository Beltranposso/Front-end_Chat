const Ruta = "http://localhost:3001"




/* Ruta de autenticacion */
export const URI_AUTENTICACION = Ruta + "/login"
/* ------------------------ */


/* Ruta para cn iteraccion  a las  cookies */
export const URI_GETUSERINFO = Ruta + "/get-user-info"
export const URI_LOGOUT = Ruta + "/Logout"
/* --------------------------------- */



/*---------Ruta para los chats-------------------------------------*/
export const URI_GETCHATS = Ruta + "/chats/chatByuser/u/"
export const URI_GETCHATS2 = Ruta + "/chats/chatByuser/c/"
export const URI_GETCHATS3 = Ruta + "/chats/chatBycoordinador/c/"
export const URI_GETCHATSABIERTOS = Ruta + "/chats/chatAbiertos/A/"
export const URI_GETCHATSCERRADOS = Ruta + "/chats/chatCerrados/C/"
export const URI_PULLASESOR = Ruta + "/chats/AssesorEntraAlchat/"
/* ---------------------------------------------------------------------*/


/* ----------------Rutas post para el registro--------------------- */
export const URI_REGISTRO = Ruta + "/usuarios/createUsers/sitio"
/* ----------------------------------------------------------------- */


/* -------------------Rutas post para los mensajes -----------------*/
export const URI_POSTMENSAJE = Ruta + "/mensajes/createMensaje/"
/*------------------------------------------------------------------ */