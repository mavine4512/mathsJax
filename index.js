import React from 'react';
import {WebView} from 'react-native-webview';
import {View, Dimensions} from "react-native";
import AutoHeightWebView from 'react-native-autoheight-webview';

const defaultOptions = {
    messageStyle: 'none',
    extensions: ['tex2jax.js'],
    jax: ['input/TeX', 'output/HTML-CSS'],
    tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
    },
    TeX: {
        extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js','cancel.js']
    }
};

function MathJax(props) {

    const {html, fontSize, mathJaxOptions, styles} = props;

    //wrap html in math jaxx.
    function wrapMathjax() {
        const options = JSON.stringify(
            Object.assign({}, defaultOptions, mathJaxOptions)
        );
        //if not mathjax present then we do not need to use mathjax.
        if (!html || (html.indexOf('$$') === -1 &&
            html.indexOf('$') === -1 &&
            html.indexOf('\(') === -1 &&
            html.indexOf('\[') === -1)) {
            return html;
        } else {
            // return `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            //     <script type="text/x-mathjax-config">
            //         MathJax.Hub.Config(${options});
            //         MathJax.Hub.Queue(function() {
            //             var height = document.documentElement.scrollHeight;
            //             window.postMessage(String(height));
            //             document.getElementById("formula").style.visibility = "visible";
            //         });
            //     </script>
            //     <script >
            //       setTimeout(function(){ document.getElementById("formula").style.visibility = "visible"; }, 5000);
            //    </script>
            //     <script src="https://mathjax.mwalimuplus.com/MathJax/MathJax.js?config=TeX-MML-AM_CHTML"></script>
            //     <div id="formula" style="visibility:hidden; font-size:${fontSize ? fontSize : '12px' }; padding-bottom:25px;">
            //         ${html}
		    //         </div>
            //     `;
            return `
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
                        <script type="text/x-mathjax-config">
                            MathJax.Hub.Config({
                                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
                                CommonHTML: { scale: 100 }, // Adjust scaling for better rendering
                                showProcessingMessages: false,
                                messageStyle: "none",
                                "HTML-CSS": { availableFonts: ["TeX"], linebreaks: { automatic: true } },
                                SVG: { linebreaks: { automatic: true } }
                            });
                            MathJax.Hub.Queue(function() {
                                // Ensure height is communicated correctly for rendering
                                var height = document.documentElement.scrollHeight;
                                window.postMessage(String(height));
                                document.getElementById("formula").style.visibility = "visible";
                            });
                        </script>
                        <script>
                            // Fallback for delayed rendering
                            setTimeout(function() {
                                var formulaElement = document.getElementById("formula");
                                if (formulaElement && formulaElement.style.visibility === "hidden") {
                                    formulaElement.style.visibility = "visible";
                                }
                            }, 5000);
                        </script>
                        <div id="formula" 
                            style="visibility: hidden; 
                                    font-size: ${fontSize ? fontSize : '14px'}; 
                                    padding-bottom: 25px; 
                                    color: ${textColor || 'black'};">
                            ${html}
                        </div>
                        `
        }
    }

    const calculatedHtml = wrapMathjax();
    // Create new props without `props.html` field. Since it's deprecated.
    const calculatedProps = Object.assign({}, props, {html: undefined});
    const calculatedStyles = Object.assign({}, {width: Dimensions.get('window').width}, styles);

    function onSizeUpdated(size) {
    }

    return (
        <AutoHeightWebView
            style={calculatedStyles}
            source={{html: calculatedHtml}}
            scalesPageToFit={false}
            onSizeUpdated={onSizeUpdated}
            viewportContent={'width=device-width, user-scalable=yes'}
            {...calculatedProps}
        />
    )
}

export default MathJax;
