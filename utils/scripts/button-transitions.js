window.onload = setTimeout(applyButtonTransitions, 50);

async function applyButtonTransitions(force = false) {

  var clipButtons = document.querySelectorAll('.clipButton');

  for (var clipButton of clipButtons) {
    if (clipButton.classList.contains('transitions-ready') && !force) continue;
    try {
      clipButton.classList.add('transitions-ready');
      let curClipButton = clipButton;

      let scaleX = (parseInt(curClipButton.querySelector('rect').getAttribute('width')) / 107) * 1.3;
      clipButton.addEventListener("mouseover", function( event ) {

        try {
          curClipButton.querySelector('.Back_Transitioner').style.transform = "scaleY(9)";
          curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
          curClipButton.querySelector('.Back_Transitioner').style.bottom = "105px";

          curClipButton.querySelector('.Front_Transitioner').style.transform = "scaleY(9)";
          curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
          curClipButton.querySelector('.Front_Transitioner').style.bottom = "100px";

          curClipButton.querySelector('span').style.color = "rgba(255,255,255,1)";
          try {
            let buttonIconElems = curClipButton.querySelectorAll('.buttonIcon');
            for (var elem of buttonIconElems) {
              elem.style.fill = "rgba(255,255,255,1)";
            }
            let buttonIcon_StrokeElems = curClipButton.querySelectorAll('.buttonIcon_Stroke');
            for (var elem of buttonIcon_StrokeElems) {
              elem.style.stroke = "rgba(255,255,255,1)";
            }
          } catch(err) {
            // console.log(err);
          }
        } catch(err) {
          // console.log(err);
        }


      }, true);

      clipButton.addEventListener("mouseleave", function( event ) {

        if (curClipButton.classList.contains('activeButton')) {
          return;
        }

        restoreNormal(curClipButton);

      }, true);

      restoreNormal(curClipButton);

      function restoreNormal(curClipButton) {

        if (!curClipButton.classList.contains('activeButton')) {
          try {
            curClipButton.querySelector('.Back_Transitioner').style.transform = "scaleY(1)";
            curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
            curClipButton.querySelector('.Back_Transitioner').style.bottom = -25 * scaleX + "px";

            curClipButton.querySelector('.Front_Transitioner').style.transform = "scaleY(1)";
            curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
            curClipButton.querySelector('.Front_Transitioner').style.bottom = -30 * scaleX + "px";

            if (curClipButton.querySelector('.clipGroup').style.display != 'none') {
              curClipButton.querySelector('span').style.color = curClipButton.querySelector('.Front_Transitioner').querySelector('path').getAttribute('fill');
              try {
                let buttonIconElems = curClipButton.querySelectorAll('.buttonIcon');
                for (var elem of buttonIconElems) {
                  elem.style.fill = curClipButton.querySelector('.Front_Transitioner').querySelector('path').getAttribute('fill');
                }
                let buttonIcon_StrokeElems = curClipButton.querySelectorAll('.buttonIcon_Stroke');
                for (var elem of buttonIcon_StrokeElems) {
                  elem.style.stroke = curClipButton.querySelector('.Front_Transitioner').querySelector('path').getAttribute('fill');
                }
              } catch(err) {
                // console.log(err);
              }
            } else {
              curClipButton.querySelector('span').style.color = 'rgba(255,255,255,1)';
              try {
                curClipButton.querySelector('.buttonIcon').style.fill = 'rgba(255,255,255,1)';
              } catch(err) {
                // console.log(err);
              }
            }
          } catch(err) {
            // console.log(err);
          }
        }
        else {
          try {
            curClipButton.querySelector('.Back_Transitioner').style.transform = "scaleY(9)";
            curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
            curClipButton.querySelector('.Back_Transitioner').style.bottom = "105px";

            curClipButton.querySelector('.Front_Transitioner').style.transform = "scaleY(9)";
            curClipButton.querySelector('.Front_Transitioner').style.transform += `scaleX(${scaleX})`;
            curClipButton.querySelector('.Front_Transitioner').style.bottom = "100px";

            curClipButton.querySelector('span').style.color = "rgba(255,255,255,1)";
            try {
              let buttonIconElems = curClipButton.querySelectorAll('.buttonIcon');
              for (var elem of buttonIconElems) {
                elem.style.fill = "rgba(255,255,255,1)";
              }
              let buttonIcon_StrokeElems = curClipButton.querySelectorAll('.buttonIcon_Stroke');
              for (var elem of buttonIcon_StrokeElems) {
                elem.style.stroke = "rgba(255,255,255,1)";
              }
            } catch(err) {
              // console.log(err);
            }
          } catch(err) {
            // console.log(err);
          }
        }

      }
    } catch(err) {
      // console.log(err);
    }
  }
}
window.applyButtonTransitions = applyButtonTransitions;
