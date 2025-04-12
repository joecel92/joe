let infotitle="";
let infocontent="";
let bg="";
export function set_info_variables(info_title,info_content,box_bg){
    infocontent=info_content;
    infotitle=info_title;
    bg=box_bg;
}
export function load_info(){
      
    document.getElementById("infotitle").innerText=infotitle;
    document.getElementById("infocontent").innerText=infocontent;
    document.getElementById("infobox").style.backgroundColor=bg;
}