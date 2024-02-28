(()=>{var e={68:(e,t,n)=>{"use strict";n.r(t),n.d(t,{colorizeHttpHistory:()=>l,observeHTTPRequests:()=>a});const{getSetting:r}=n(280),{modifyItemRow:o,isHighlighted:s,getRowIDColor:c}=n(532);let i;const a=()=>{const e=document.querySelector(".c-table__wrapper");e&&(i&&(i.disconnect(),i=null),i=new MutationObserver((e=>{e.forEach((e=>{if("highlighted"===e.attributeName){const t=e.target;return void d(t)}if(0===e.addedNodes.length)return;const t=e.addedNodes[0];if(t.classList?.contains("c-table__item-row")){if("Loading..."==t.textContent.trim())return void setTimeout((()=>{null!=t&&"Loading..."!=t.textContent.trim()&&o(t)}),1e3);o(t)}})),e.some((e=>e.target.getAttribute("colorized")))||l()})),i.observe(e,{childList:!0,characterData:!0,attributes:!0,subtree:!0}))},l=()=>{document.querySelectorAll('.c-item-cell[data-column-id="REQ_QUERY"]').forEach((e=>d(e)))},d=e=>{const t=e.parentElement,n=t.querySelector(".c-item-cell[data-column-id='ID']").textContent;s(n)?(t.style.backgroundColor=c(n),t.setAttribute("colorized","true")):(t.style.backgroundColor="",t.setAttribute("colorized","false"))}},532:(e,t,n)=>{"use strict";n.r(t),n.d(t,{getProjectName:()=>b,getRowIDColor:()=>v,isHighlighted:()=>m,listenForRightClick:()=>r,modifyContextMenu:()=>l,modifyItemRow:()=>o,removeHighlightedRow:()=>g,storeHighlightedRow:()=>u});const r=()=>{document.querySelectorAll(".c-table__item-row").forEach(o)},o=e=>{e.removeEventListener("contextmenu",a),e.addEventListener("contextmenu",a),e.removeEventListener("click",c),e.addEventListener("click",c)};let s=null;const c=e=>{let t=e.target.closest(".c-item-row");t&&(s=t.querySelector(".c-item-cell[data-column-id='ID']").textContent,setTimeout((()=>{i()}),10))},i=()=>{const e=document.querySelector(".c-request-skeleton__body");e&&(e.removeEventListener("contextmenu",a),e.addEventListener("contextmenu",a))},a=e=>{const t=e.target;if(t.closest(".c-request-skeleton__body"))return void setTimeout((()=>l(s,null)),10);const n=t.closest(".c-item-row");if(!n)return;const r=n.querySelector(".c-item-cell[data-column-id='ID']").textContent;c(e),setTimeout((()=>l(r,n)),10)},l=(e,t)=>{const n=document.querySelector(".c-menu"),r=n.querySelectorAll(".c-item"),o=n.querySelectorAll(".c-divider");if(!n||!r||!o)return;t||(t=(e=>{const t=document.querySelectorAll(".c-item-row .c-item-cell[data-column-id='ID']");for(let n=0;n<t.length;n++)if(t[n].textContent===e)return t[n].closest(".c-item-row")})(e));const s=o[0].cloneNode(!0);n.insertBefore(s,r[r.length]);const c=n.querySelector(".fa-caret-right").parentElement.parentElement.cloneNode(!0);c.querySelector(".c-item__content").textContent="Highlight row",c.querySelector(".c-item__menu").insertAdjacentHTML("beforeend",'\n        <div class="c-item__menu evenbetter__c-item__menu">\n          <div class="c-menu evenbetter__c-menu">\n            <div\n              class="c-item evenbetter__c-item"\n            >\n              <div class="c-item__content evenbetter__c-item__content">None</div>\n            </div>\n            <div\n              class="c-item evenbetter__c-item"\n            >\n              <div class="c-item__content evenbetter__c-item__content">Red</div>\n            </div>\n            <div\n              class="c-item evenbetter__c-item"\n            >\n              <div class="c-item__content evenbetter__c-item__content">Green</div>\n            </div>\n            <div\n              class="c-item evenbetter__c-item"\n            >\n              <div class="c-item__content evenbetter__c-item__content">Blue</div>\n            </div>\n            <div\n              class="c-item evenbetter__c-item"\n            >\n              <div class="c-item__content evenbetter__c-item__content">Orange</div>\n            </div>\n          </div>\n        </div>\n      '),c.id="highlightRowMenu",c.querySelector(".c-item__menu").style.display="none",c.querySelectorAll(".c-item").forEach((e=>{let t=e.querySelector(".c-item__content").textContent;e.style.paddingLeft="0.35rem",e.style.borderRadius=0,"None"!==t&&(e.style.borderLeft="3px solid",e.style.borderLeftColor=t)})),c.addEventListener("mouseenter",(()=>{c.querySelector(".c-item__menu").style.display="block";const e=c.querySelector(".c-item__menu");e.style.left=0,e.style.top="120px"})),r.forEach((e=>e.addEventListener("mouseenter",d))),c.querySelectorAll(".c-item").forEach((n=>{n.addEventListener("click",(()=>{let r=n.querySelector(".c-item__content").textContent;"None"===r?(t&&(t.style.backgroundColor="",t.removeAttribute("highlighted")),g(e)):(t&&(t.style.backgroundColor=r,t.setAttribute("highlighted",r)),u(e,r)),d()}))})),n.insertBefore(c,r[r.length])},d=()=>{const e=document.getElementById("highlightRowMenu");e&&(e.querySelector(".c-item__menu").style.display="none")},u=(e,t)=>{const n=JSON.parse(localStorage.getItem(b()+".highlightedRows"))||{};n[e]=t,localStorage.setItem(b()+".highlightedRows",JSON.stringify(n))},g=e=>{const t=JSON.parse(localStorage.getItem(b()+".highlightedRows"))||{};delete t[e],localStorage.setItem(b()+".highlightedRows",JSON.stringify(t))},m=e=>void 0!==(JSON.parse(localStorage.getItem(b()+".highlightedRows"))||{})[e],v=e=>(JSON.parse(localStorage.getItem(b()+".highlightedRows"))||{})[e],b=()=>{let e=document.querySelector(".c-current-project .c-current-project__right")?.textContent;return e||"Untitled"}},632:(e,t,n)=>{"use strict";n.r(t),n.d(t,{evenBetterTab:()=>l});const{getSetting:r,setSetting:o,defaultSettings:s,checkForUpdates:c}=n(280),{themes:i,loadTheme:a}=n(156),l=()=>{const e=r("theme"),t=document.createElement("div");t.innerHTML=function(e,t){return`\n  <div class="even-better__settings" id="evenbetter-settings-content">\n    <header>\n      <div class="header-title">\n        <h1>EvenBetter ${s.currentVersion} - Settings</h1>\n        <div class="header-outdated" style="display:none;">You are using outdated version!</div>\n      </div>\n      <div class="header-description">\n        Customize EvenBetter plugin here and make your Caido even better :D\n      </div>\n    </header>\n\n    <main>\n      <div class="left">\n        <div class="settings-box">\n          \x3c!-- Settings header --\x3e\n          <div class="settings-box__header">\n            <div class="settings-box__header-title">Themes</div>\n            <div class="settings-box__header-description">\n              Change the appearance of your Caido\n            </div>\n          </div>\n\n          \x3c!-- Settings content --\x3e\n          <div class="settings-box__content">\n            <select>\n              ${Object.keys(e).map((n=>`<option value="${n}" ${t==n?"selected":""}>${e[n].name}</option>`)).join("")}\n            </select>\n          </div>\n        </div>\n\n        ${"true"==r("ssrfInstanceFunctionality")?'\n        <div class="settings-box ssrfInstanceFunctionality">\n          \x3c!-- Settings header --\x3e\n          <div class="settings-box__header">\n            <div class="settings-box__header-title">Quick SSRF placeholder</div>\n            <div class="settings-box__header-description">\n              Set the placeholder that will be used to create new SSRF instance\n            </div>\n          </div>\n\n          \x3c!-- Settings content --\x3e\n          <div class="settings-box__content">\n            <div class="c-text-input">\n              <div class="c-text-input__outer">\n                <div class="c-text-input__inner">\n                  <input\n                    placeholder="$ssrfinstance"\n                    spellcheck="false"\n                    class="c-text-input__input"\n                  />\n                </div>\n              </div>\n            </div>\n\n            <button disabled>Save</button>\n          </div>\n        </div>':""}\n      </div>\n\n      <div class="right">\n        <div class="toggle-features">\n          <div class="toggle-features__header">\n            <div class="toggle-features__header-title">Toggle features</div>\n            <div class="toggle-features__header-description">\n              Enable or disable features of the EvenBetter plugin\n            </div>\n          </div>\n          <hr />\n          <div class="toggle-features__content">\n            ${[{name:"sidebarTweaks",title:"Sidebar tweaks",items:[{name:"sidebarRearrangeGroups",title:"Groups Rearrange",description:"Show move buttons next to sidebar groups."},{name:"sidebarHideGroups",title:"Groups Collapse",description:"This allows you to collapse groups in the sidebar."}]},{name:"ssrfInstanceFunctionality",title:"Quick SSRF Instance",items:[{name:"ssrfInstanceFunctionality",title:"Quick SSRF Instance",description:"Quickly create new ssrf.cvssadvisor.com instance by typing the placeholder."}]},{name:"highlightRowsFunctionality",title:"Highlight Rows",items:[{name:"highlightRowsFunctionality",title:"Highlight Rows",description:"Right click to highlight rows on the HTTP History page."}]},{name:"versionCheckWarning",title:"Version Check Warning",items:[{name:"showOutdatedVersionWarning",title:"Version Check Warning",description:"Choose if you want to see warning on startup if you are using outdated EvenBetter version."}]}].map((e=>`\n              <div class="toggle-features__content-item">\n                <div class="toggle-features__content-item-title">\n                  ${e.title}\n                </div>\n\n                ${e.items.map((e=>`\n                  <div class="toggle-features__content-item-toggle">\n                    <div class="toggle-features__content-item-description">\n                      <b>${e.title}:</b> ${e.description}\n                    </div>\n                    <div>\n                      <input type="checkbox" name="${e.name}" id="${e.name}" ${"true"===r(e.name)?"checked":""} />\n                    </div>\n                  </div>`)).join("")}\n\n              </div>\n\n              <hr />`)).join("")}\n\n            <button disabled>Save</button>\n          </div>\n        </div>\n      </div>\n    </main>\n  </div>`}(i,e),t.querySelector("select").addEventListener("change",(e=>{const t=e.target.value;o("theme",t),a(t)}));const n=[];let l=!1;t.querySelectorAll("input[type=checkbox]").forEach((e=>{e.addEventListener("change",(e=>{const r=e.target.name,o=e.target.checked,s=n.findIndex((e=>e.name===r));-1!==s?n.splice(s,1):n.push({name:r,value:o}),l=n.length>0;const c=t.querySelector(".toggle-features__content button");l?c.removeAttribute("disabled"):c.setAttribute("disabled",!0)}))})),t.querySelector(".toggle-features__content button").addEventListener("click",(()=>{n.forEach((e=>{o(e.name,e.value)})),location.reload()}));const d=t.querySelector(".ssrfInstanceFunctionality");if(d){const e=[];d.querySelector("input").value=r("ssrfInstancePlaceholder"),d.querySelector("input").addEventListener("input",(t=>{const n=t.target.value;e.push({name:"ssrfInstancePlaceholder",value:n}),d.querySelector("button").removeAttribute("disabled")})),d.querySelector("button").addEventListener("click",(()=>{e.forEach((e=>{o(e.name,e.value),location.reload()}))}))}return c().then((({isLatest:e,message:n})=>{e||(t.querySelector(".header-outdated").style.display="block")})),t}},580:(e,t,n)=>{"use strict";n.r(t),n.d(t,{replaceSSRFInstanceText:()=>o});const{getSetting:r}=n(280),o=(e,t)=>{const n=t.replace(r("ssrfInstancePlaceholder"),"$creating_instance");e.target.textContent=n,fetch("https://api.cvssadvisor.com/ssrf/api/instance",{method:"POST"}).then((e=>e.json())).then((t=>{const r=n.replace("$creating_instance","https://"+t+".c5.rs");e.target.textContent=r,window.open("https://ssrf.cvssadvisor.com/instance/"+t)})).catch((()=>{const t=n.replace("$creating_instance","$creating_instance_failed");e.target.textContent=t}))}},268:(e,t,n)=>{"use strict";n.r(t),n.d(t,{onScopeTabOpen:()=>r});const r=()=>{o(),c()},o=()=>{const e=document.querySelector(".c-header__actions");if(!e)return;document.querySelector("#scope-presents-import")?.remove();const t=e.children[0].cloneNode(!0);t.querySelector(".c-button__label").innerHTML='<div class="c-button__leading-icon"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n  <path d="M12 3L12 15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n  </svg></div><p style="\n      margin: 0;\n  ">Import</p>',t.id="scope-presents-import",t.addEventListener("click",(()=>{const e=document.createElement("input");e.type="file",e.accept=".json",e.style.display="none",e.addEventListener("change",(e=>{const t=e.target.files[0],n=new FileReader;n.onload=e=>{const t=JSON.parse(e.target.result);a(t)},n.readAsText(t)})),document.body.prepend(e),e.click(),e.remove()})),e.style.gap="0.8rem",e.style.display="flex",e.appendChild(t)};let s;const c=()=>{const e=document.querySelector(".c-preset-form-create").parentElement;e&&(s&&(s.disconnect(),s=null),s=new MutationObserver((e=>{e.some((e=>"style"===e.attributeName||e.target.classList.contains("c-preset-form-create__header")))||i()})),s.observe(e,{childList:!0,attributes:!0,subtree:!0}))},i=()=>{document.querySelector("#scope-presents-download")?.remove();const e=document.querySelector(".c-preset-form-create__header"),t=e.querySelector(".c-scope-tooltip").cloneNode(!0);t.id="scope-presents-download",t.querySelector("button").innerHTML='<div data-v-f56ffbcc="" class="c-button__leading-icon"><i data-v-f56ffbcc="" class="c-icon fas fa-file-arrow-down"></i></div>Download',t.querySelector("button").addEventListener("click",(()=>{const e=d();e&&l(e).then((e=>{e.json().then((e=>{const t=JSON.stringify(e.data.scope,null,2),n=new Blob([t],{type:"application/json"}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download="scope-"+e.data.scope.name+".json",o.click()}))}))})),e.appendChild(t)},a=e=>{const t={operationName:"createScope",query:"mutation createScope($input: CreateScopeInput!) {\n  createScope(input: $input) {\n    error {\n      ... on InvalidGlobTermsUserError {\n        ...invalidGlobTermsUserErrorFull\n      }\n      ... on OtherUserError {\n        ...otherUserErrorFull\n      }\n    }\n    scope {\n      ...scopeFull\n    }\n  }\n}\nfragment invalidGlobTermsUserErrorFull on InvalidGlobTermsUserError {\n  ...userErrorFull\n  terms\n}\nfragment userErrorFull on UserError {\n  __typename\n  code\n}\nfragment otherUserErrorFull on OtherUserError {\n  ...userErrorFull\n}\nfragment scopeFull on Scope {\n  __typename\n  id\n  name\n  allowlist\n  denylist\n  indexed\n}",variables:{input:{allowlist:e.allowlist,denylist:e.denylist,name:e.name}}};fetch(document.location.origin+"/graphql",{body:JSON.stringify(t),method:"POST",headers:{Authorization:"Bearer "+JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken}})},l=e=>{const t={operationName:"scope",query:"query scope($id:ID!) {\n scope(id: $id){\n id\n name\n allowlist\n denylist \n }\n }",variables:{id:`${e}`}};return fetch(document.location.origin+"/graphql",{body:JSON.stringify(t),method:"POST",headers:{Authorization:"Bearer "+JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken}})},d=()=>document.querySelector('.c-preset[data-is-selected="true"]')?.getAttribute("data-preset-id")},136:(e,t,n)=>{const{getSetting:r}=n(280),o=()=>{document.querySelectorAll(".c-sidebar-group").forEach((e=>{const t=e.children[0].textContent.trim(),n=e.getAttribute("data-is-group-collapsed");localStorage.setItem(`evenbetter_${t}_isCollapsed`,n)}))};e.exports={addGroupHideFunctionality:()=>{"true"===r("sidebarHideGroups")&&document.querySelectorAll(".c-sidebar-group__title").forEach((e=>{"..."!==e.textContent&&e.addEventListener("click",(()=>{const t=e.parentElement,n=t.querySelector(".c-sidebar-group__items"),r=t.getAttribute("data-is-group-collapsed");n.style.display="true"===r?"block":"none",t.setAttribute("data-is-group-collapsed","true"===r?"false":"true"),o()}))}))},restoreSidebarGroupCollapsedStates:()=>{"true"===r("sidebarHideGroups")&&document.querySelectorAll(".c-sidebar-group").forEach((e=>{const t=e.children[0].textContent.trim(),n=localStorage.getItem(`evenbetter_${t}_isCollapsed`);n&&(e.setAttribute("data-is-group-collapsed",n),e.querySelector(".c-sidebar-group__items").style.display="true"===n?"none":"block")}))},storeSidebarGroupCollapsedStates:o}},60:(e,t,n)=>{const{getSetting:r}=n(280),o=(e,t)=>{const n=Array.from(e.parentElement.children).indexOf(e);if("up"===t&&n>0||"down"===t&&n<e.parentElement.children.length-1){const r="up"===t?n-1:n+1;if(0==r)return;const o=e.parentElement.children[r+("up"===t?0:1)];e.parentElement.insertBefore(e,o),s()}},s=()=>{document.querySelectorAll(".c-sidebar-group").forEach((e=>{const t=e.children[0].textContent.trim(),n=Array.from(e.parentElement.children).indexOf(e);localStorage.setItem(`evenbetter_${t}_position`,n)}))};e.exports={addMoveButtonsToSidebar:()=>{"true"===r("sidebarRearrangeGroups")&&(document.querySelectorAll(".c-sidebar-group__title").forEach((e=>{const t=e.textContent;"..."!==t&&((e,t)=>{e.innerHTML=`\n        <div style="display:flex;justify-content:space-between;align-items:center;">${t}\n          <div class="c-sidebar-group__rearrange-arrows">\n              <svg class="c-sidebar-group__move-up" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n              </svg>\n              <svg class="c-sidebar-group__move-down" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n              </svg>\n          </div>\n        `})(e,t)})),document.querySelectorAll(".c-sidebar-group").forEach((e=>{const t=e.querySelector(".c-sidebar-group__move-up"),n=e.querySelector(".c-sidebar-group__move-down");t&&n&&(t.addEventListener("click",(t=>{o(e,"up"),t.stopPropagation()})),n.addEventListener("click",(t=>{o(e,"down"),t.stopPropagation()})))})))},restoreSidebarGroupPositions:()=>{"true"===r("sidebarRearrangeGroups")&&document.querySelectorAll(".c-sidebar-group").forEach((e=>{const t=e.children[0].textContent.trim(),n=localStorage.getItem(`evenbetter_${t}_position`);n&&e.parentElement.insertBefore(e,e.parentElement.children[n])}))},storeSidebarGroupPositions:s}},184:(e,t,n)=>{"use strict";n.r(t),n.d(t,{debug:()=>c,error:()=>s,info:()=>o});const{getSetting:r}=n(280),o=e=>{console.log(`${(new Date).toString()} [EvenBetter] [INFO] ${e}`)},s=e=>{console.error(`${(new Date).toString()} [EvenBetter] [ERROR] ${e}`)},c=e=>{"true"===r("debugMode")&&console.log(`${(new Date).toString()} [EvenBetter] [DEBUG] ${e}`)}},868:(e,t,n)=>{"use strict";n.r(t),n.d(t,{openModal:()=>o});const r=()=>{document.querySelector(".evenbetter-modal").remove()},o=(e,t)=>{null!==document.querySelector(".evenbetter-modal")&&r();const n=((e,t)=>{const n=document.createElement("div");return n.classList.add("evenbetter-modal"),n.innerHTML='\n    <div class="evenbetter-modal__content">\n        <div class="evenbetter-modal__content-header">\n            <h2 class="evenbetter-modal__content-header-title"></h2>\n        </div>\n        <div class="evenbetter-modal__content-body">\n            <p class="evenbetter-modal__content-body-text"></p>\n            <button class="evenbetter-modal__content-body-close">\n                Close\n            </button>\n        </div>\n    </div>\n  ',n.querySelector(".evenbetter-modal__content-header-title").textContent=e,n.querySelector(".evenbetter-modal__content-body-text").innerHTML=t,n.querySelector(".evenbetter-modal__content-body-close").addEventListener("click",r),n})(e,t);document.body.appendChild(n)}},280:(e,t,n)=>{"use strict";n.r(t),n.d(t,{checkForUpdates:()=>c,defaultSettings:()=>r,getSetting:()=>o,setSetting:()=>s});const r={ssrfInstancePlaceholder:"$ssrfinstance",sidebarHideGroups:"true",sidebarRearrangeGroups:"true",ssrfInstanceFunctionality:"true",showOutdatedVersionWarning:"true",highlightRowsFunctionality:"true",debugMode:"false",evenBetterVersionCheckUrl:"https://raw.githubusercontent.com/bebiksior/EvenBetter/main/version.txt",currentVersion:"v1.6"},o=e=>null===localStorage.getItem(`evenbetter_${e}`)?r[e]:localStorage.getItem(`evenbetter_${e}`),s=(e,t)=>{localStorage.setItem(`evenbetter_${e}`,t)},c=async()=>{try{const e=await fetch(r.evenBetterVersionCheckUrl,{cache:"no-store"}),t=await e.text(),n=parseFloat(t.replace("v",""));return parseFloat(r.currentVersion.replace("v",""))>n?{isLatest:!0,message:`You are using a development version: ${r.currentVersion}.`}:t.trim()===r.currentVersion?{isLatest:!0,message:"You are using the latest version! 🎉"}:{isLatest:!1,message:`New EvenBetter version available: ${t}.`}}catch(e){return{isLatest:!1,message:"Failed to check for updates"}}}},156:(e,t,n)=>{"use strict";n.r(t),n.d(t,{loadTheme:()=>o,themes:()=>r});const r={evendarker:{name:"Even Darker","--c-header-cell-border":"#101010","--c-bg-default":"#050607","--c-bg-subtle":"#090a0c","--c-table-item-row":"#08090a","--c-table-item-row-hover":"#0f1012","--header-cell-width":"1px","--c-table-even-item-row":"#08090a","--c-fg-default":"var(--c-white-100)","--c-fg-subtle":"var(--c-gray-400)","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"var(--c-bg-default)"},caido:{name:"Caido Default","--c-header-cell-border":"#101010","--c-bg-default":"#25272d","--c-bg-subtle":"var(--c-gray-800)","--c-table-item-row":"#08090a","--c-table-item-row-hover":"#25272d","--header-cell-width":"0px","--c-table-even-item-row":"#353942","--c-fg-default":"var(--c-white-100)","--c-fg-subtle":"var(--c-gray-400)","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"var(--c-bg-default)"},gray:{name:"Gray","--c-header-cell-border":"#101010","--c-bg-default":"#202020","--c-bg-subtle":"#252525","--c-table-item-row":"#252525","--c-table-item-row-hover":"#303030","--header-cell-width":"1px","--c-table-even-item-row":"#252525","--c-fg-default":"var(--c-white-100)","--c-fg-subtle":"var(--c-gray-400)","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"var(--c-bg-default)"},oceanblue:{name:"Ocean Blue","--c-header-cell-border":"#116699","--c-bg-default":"#1a2b3c","--c-bg-subtle":"#2a3b4c","--c-table-item-row":"#1c2d3e","--c-table-item-row-hover":"#2a3b4c","--header-cell-width":"0px","--c-table-even-item-row":"#2c3d4e","--c-fg-default":"var(--c-white-100)","--c-fg-subtle":"var(--c-gray-400)","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"var(--c-bg-default)"},solarized:{name:"Solarized","--c-header-cell-border":"#93a1a1","--c-bg-default":"#002b36","--c-bg-subtle":"#073642","--c-table-item-row":"#073642","--c-table-item-row-hover":"#586e75","--header-cell-width":"1px","--c-table-even-item-row":"#073642","--c-fg-default":"#93a1a1","--c-fg-subtle":"#657b83","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"#073642"},black:{name:"Black","--c-header-cell-border":"#000000","--c-bg-default":"#111111","--c-bg-subtle":"#070707","--c-table-item-row":"#050505","--c-table-item-row-hover":"#222222","--header-cell-width":"0px","--c-table-even-item-row":"#111111","--c-fg-default":"var(--c-white-100)","--c-fg-subtle":"var(--c-gray-400)","--selection-background":"rgba(255, 255, 255, 0.15)","--selected-row-background":"var(--c-bg-default)"}},o=e=>{const t=r[e];t&&Object.keys(t).forEach((e=>{document.documentElement.style.setProperty(e,t[e],"important")}))}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,n),s.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const{loadTheme:e}=n(156),{addMoveButtonsToSidebar:t,restoreSidebarGroupPositions:r}=n(60),{getSetting:o,checkForUpdates:s}=n(280),{addGroupHideFunctionality:c,restoreSidebarGroupCollapsedStates:i}=n(136),{evenBetterTab:a}=n(632),{replaceSSRFInstanceText:l}=n(580),{observeHTTPRequests:d,colorizeHttpHistory:u}=n(68),{onScopeTabOpen:g}=n(268),{openModal:m}=n(868),{listenForRightClick:v}=n(532),{debug:b,info:h}=n(184),p=e=>{switch(b("Tab opened:",e),!0){case e.startsWith("#/settings/"):setTimeout((()=>{const t=e.split("/")[2];y(t),S("EvenBetter")}),10);break;case"#/intercept"===e&&"true"===o("highlightRowsFunctionality"):setTimeout((()=>{u(),d(),v()}),200);break;case"#/replay"===e:setTimeout((()=>{E()}),25);break;case"#/scope"===e:setTimeout(g,10)}},_=e=>{const t=document.querySelectorAll(".c-settings__navigation .c-underline-nav .c-button");return Array.from(t).find((t=>t.textContent.toLowerCase()===e)).closest(".c-underline-nav-item")},y=e=>{b("Settings tab opened: ",e);const t=_(e);f(t);const n=document.querySelector(".c-settings__content");switch(e){case"developer":setTimeout((()=>{document.querySelector(".c-custom-js__footer").addEventListener("click",(()=>{setTimeout((()=>{location.reload()}),300)}))}),50);break;case"evenbetter":return n.children[0].style.display="none",document.querySelector("#evenbetter-settings-content")&&document.querySelector("#evenbetter-settings-content").remove(),void n.appendChild(a())}document.querySelector("#evenbetter-settings-tab")?.setAttribute("data-is-active","false"),n.children[0].style.display="block",document.querySelector("#evenbetter-settings-content")?.remove()},f=e=>{"true"!=e.getAttribute("data-is-active")&&e.setAttribute("data-is-active","true"),Array.from(document.querySelector(".c-settings__navigation .c-underline-nav").children).filter((t=>t!==e)).forEach((e=>e.setAttribute("data-is-active","false")))},S=e=>{const t=document.querySelector(".c-settings__navigation .c-underline-nav"),n=document.querySelector(`#${e.toLowerCase()}-settings-tab`);n&&n.remove();const r=t.children[0].cloneNode(!0);r.querySelector(".c-button__label").textContent=r.textContent.replace("General",e),r.setAttribute("data-is-active","false"),r.id=e.toLowerCase()+"-settings-tab",r.addEventListener("click",(()=>{const t=new URL(location.href).hash.split("/")[2],n=_(t);n.addEventListener("click",(()=>{f(n),y(t),n.removeEventListener("click",(()=>{}))})),f(r),y(e.toLowerCase())})),t.appendChild(r)};let w;const E=()=>{if("true"!==o("ssrfInstanceFunctionality"))return;const e=document.querySelector(".c-replay-entry .cm-content");e&&(w&&(w.disconnect(),w=null),w=new MutationObserver((e=>{e.forEach((e=>{const t=e.target.textContent;t.includes(o("ssrfInstancePlaceholder"))&&l(e,t)}))})),w.observe(e,{characterData:!0,subtree:!0}))};let k;const x=()=>{h(`EvenBetter v${o("currentVersion")} is loading, thanks for using it! 🎉`),C(),e(o("theme")),t(),c(),navigation.addEventListener("navigate",(e=>{if("push"==e.navigationType){const t=new URL(e.destination.url).hash;p(t)}})),k&&(k.disconnect(),k=null),k=new MutationObserver((e=>{e.forEach((e=>{"true"===e.target.getAttribute("data-is-collapsed")||(t(),c(),r(),i())}))})),k.observe(document.querySelector(".c-sidebar__toggle"),{attributes:!0,subtree:!0}),r(),i(),"true"===o("showOutdatedVersionWarning")&&s().then((({isLatest:e,message:t})=>{e||m("Update available!","You are using an outdated version of EvenBetter. Please update to the latest version at https://github.com/bebiksior/EvenBetter. This popup can be disabled in the EvenBetter settings.")}));const n=new URL(location.href).hash;n&&setTimeout((()=>p(n)))},q=setInterval((()=>{document.querySelector(".c-sidebar__body")&&(clearInterval(q),x())}),100),C=()=>{const e=document.querySelector("#evenbetter-update-status");e&&(e.remove(),b("Update status removed"));const t=document.querySelector("#evenbetter-settings-content");t&&(t.remove(),b("Settings content removed"));const n=document.querySelector("#evenbetter-settings-tab");n&&(n.remove(),b("Settings tab removed"))}})()})();