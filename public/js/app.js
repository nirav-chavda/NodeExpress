function checkConfirm() {
    if( $('#pswrd').val() != $('#cnfrm_pswrd').val() ) {
        alert('password confirmation does not match');
        return false;
    }
}