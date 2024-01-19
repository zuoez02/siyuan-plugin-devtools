import { Plugin, openTab, Menu, getFrontend } from 'siyuan';
import VConsole from 'vconsole';
import Tab from './tab.svelte';
import "./index.scss";

const TAB_TYPE = 'devtool-plugin';

export default class DevtoolPlugin extends Plugin {
    isMobile = false;

    VConsole = null;

    config = {
        username: '',
        vconsole: false,
    }

    onload() {
        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        this.loadConfig().then(() => {
            if (this.config.vconsole) {
                this.toggleVconsole(this.config.vconsole);
            }
        });

        this.addIcons(`<symbol id="iconDevtools" viewBox="0 0 1024 1024">
            <path d="M230.024533 218.052267m-12.305066 0a12.305067 12.305067 0 1 0 24.610133 0 12.305067 12.305067 0 1 0-24.610133 0Z" fill="#F3D091" p-id="6555"></path><path d="M236.928 119.176533l-0.657067 45.056 14.250667-42.410666c0.853333-2.7904 5.461333-15.6672-3.182933-17.408-8.584533-1.706667-10.760533 6.656-10.410667 14.762666zM167.04 143.880533l35.114667 28.253867L177.493333 134.801067c-1.664-2.397867-8.977067-13.960533-15.6672-8.2176-6.638933 5.717333-1.3824 12.578133 5.213867 17.297066zM303.419733 150.135467l-28.868266 34.6112 37.76-23.995734c2.423467-1.621333 14.114133-8.738133 8.482133-15.522133-5.589333-6.741333-12.544-1.604267-17.373867 4.906667zM134.280533 212.846933l45.073067-0.136533-42.666667-13.499733c-2.798933-0.810667-15.761067-5.1968-17.339733 3.4816-1.5616 8.618667 6.8352 10.641067 14.933333 10.154666zM162.8928 281.8304l28.561067-34.858667-37.546667 24.337067c-2.414933 1.6384-14.045867 8.849067-8.354133 15.5904 5.649067 6.690133 12.561067 1.493333 17.339733-5.060267zM329.429333 218.308267l-45.064533-0.256 42.538667 13.866666c2.798933 0.836267 15.7184 5.341867 17.373866-3.328 1.6384-8.6016-6.741333-10.7008-14.848-10.282666zM298.4192 285.943467l-33.314133-30.353067 22.331733 38.775467c1.5104 2.491733 8.106667 14.481067 15.1296 9.156266 6.980267-5.290667 2.1504-12.4672-4.1472-17.578666zM229.205333 314.760533l-2.090666-45.021866-11.630934 43.204266c-0.682667 2.833067-4.5056 15.9744 4.232534 17.169067 8.6784 1.194667 10.333867-7.287467 9.4976-15.36z" fill="#FFDA98" p-id="6556"></path><path d="M246.6816 250.7264l-9.770667-25.8816 1.416534 27.434667c0.128 1.783467 0.392533 10.180267 5.717333 9.216 5.290667-0.938667 4.6592-6.212267 2.6368-10.769067zM268.279467 230.237867l-25.941334-9.608534 21.623467 16.930134c1.4336 1.0752 7.944533 6.382933 10.717867 1.732266 2.756267-4.616533-1.6384-7.594667-6.4-9.045333zM217.557333 249.463467l9.156267-26.112-16.554667 21.922133c-1.041067 1.450667-6.229333 8.055467-1.536 10.752 4.6592 2.670933 7.560533-1.774933 8.9344-6.570667zM197.563733 229.256533l25.1392-11.554133-27.264 3.328c-1.774933 0.256-10.129067 1.109333-8.8064 6.3488 1.322667 5.213867 6.528 4.206933 10.922667 1.877333zM267.392 200.1664l-24.9344 11.9808 27.204267-3.797333c1.7664-0.290133 10.112-1.28 8.686933-6.510934-1.408-5.188267-6.596267-4.096-10.9568-1.681066zM246.331733 181.316267l-9.608533 25.941333 16.930133-21.623467c1.0752-1.4336 6.382933-7.936 1.732267-10.717866-4.616533-2.756267-7.594667 1.6384-9.045333 6.4zM196.590933 200.925867l26.112 9.156266-21.930666-16.554666c-1.450667-1.0496-8.046933-6.237867-10.743467-1.536-2.670933 4.6592 1.774933 7.552 6.562133 8.9344zM217.984 180.736l11.101867 25.344-2.8416-27.323733c-0.221867-1.774933-0.930133-10.154667-6.203734-8.9088-5.230933 1.220267-4.317867 6.4512-2.056533 10.888533z" fill="#FFFFFF" p-id="6557"></path><path d="M181.111467 81.877333l28.672 60.996267-8.669867-66.3552c-0.6656-4.309333-2.909867-24.644267-15.6672-21.307733-12.672 3.328-10.112 16-4.334933 26.666666zM264.328533 354.935467l-9.173333-66.773334 28.868267 60.3648c1.792 3.985067 10.9824 22.263467-1.536 26.402134-12.4416 4.1216-17.194667-7.901867-18.158934-19.9936zM102.570667 158.609067l63.402666 22.869333-53.0432-40.789333C109.397333 138.112 93.44 125.320533 86.784 136.704c-6.613333 11.306667 4.155733 18.4576 15.786667 21.9136zM293.265067 85.051733l-22.869334 63.402667 40.789334-53.0432c2.5856-3.524267 15.377067-19.498667 3.9936-26.154667-11.3152-6.6048-18.4576 4.164267-21.9136 15.786667zM99.5584 267.5456l61.013333-28.672-66.363733 8.669867c-4.309333 0.6656-24.6528 2.909867-21.307733 15.6672 3.328 12.672 15.991467 10.112 26.658133 4.334933zM364.100267 166.946133l-61.0048 28.672 66.3552-8.669866c4.309333-0.6656 24.6528-2.909867 21.307733-15.6672-3.328-12.672-15.991467-10.112-26.658133-4.334934zM173.141333 346.5728l21.751467-63.7952-39.8592 53.751467c-2.517333 3.566933-15.0272 19.754667-3.5328 26.2144 11.426133 6.408533 18.3808-4.48 21.640533-16.170667zM366.097067 276.232533l-63.0016-23.970133 52.334933 41.710933c3.473067 2.645333 19.217067 15.709867 26.069333 4.437334 6.8096-11.178667-3.84-18.517333-15.402666-22.186667z" fill="#FF672B" p-id="6558"></path><path d="M794.632533 772.5568m-12.305066 0a12.305067 12.305067 0 1 0 24.610133 0 12.305067 12.305067 0 1 0-24.610133 0Z" fill="#F3D091" p-id="6559"></path><path d="M801.536 673.681067l-0.657067 45.056 14.250667-42.410667c0.853333-2.7904 5.461333-15.6672-3.182933-17.408-8.584533-1.706667-10.760533 6.656-10.410667 14.762667zM731.648 698.385067l35.114667 28.253866L742.101333 689.3056c-1.664-2.397867-8.977067-13.960533-15.6672-8.2176-6.638933 5.717333-1.3824 12.578133 5.213867 17.297067zM868.027733 704.64l-28.868266 34.6112 37.76-23.995733c2.423467-1.621333 14.114133-8.738133 8.482133-15.522134-5.589333-6.741333-12.544-1.604267-17.373867 4.906667zM698.888533 767.351467l45.073067-0.136534-42.666667-13.499733c-2.798933-0.810667-15.761067-5.1968-17.339733 3.4816-1.5616 8.618667 6.8352 10.641067 14.933333 10.154667zM727.5008 836.334933l28.561067-34.858666-37.546667 24.337066c-2.414933 1.6384-14.045867 8.849067-8.354133 15.5904 5.649067 6.690133 12.561067 1.493333 17.339733-5.060266zM894.037333 772.8128l-45.064533-0.256 42.538667 13.866667c2.798933 0.836267 15.7184 5.341867 17.373866-3.328 1.6384-8.6016-6.741333-10.7008-14.848-10.282667zM863.0272 840.448l-33.314133-30.353067 22.331733 38.775467c1.5104 2.491733 8.106667 14.481067 15.1296 9.156267 6.980267-5.290667 2.1504-12.4672-4.1472-17.578667zM793.813333 869.265067l-2.090666-45.021867-11.630934 43.204267c-0.682667 2.833067-4.5056 15.9744 4.232534 17.169066 8.6784 1.194667 10.333867-7.287467 9.4976-15.36z" fill="#FFDA98" p-id="6560"></path><path d="M811.2896 805.230933l-9.770667-25.8816 1.416534 27.434667c0.128 1.783467 0.392533 10.180267 5.717333 9.216 5.290667-0.938667 4.6592-6.212267 2.6368-10.769067zM832.887467 784.7424l-25.941334-9.608533 21.623467 16.930133c1.4336 1.0752 7.944533 6.382933 10.717867 1.732267 2.756267-4.616533-1.6384-7.594667-6.4-9.045334zM782.165333 803.968l9.156267-26.112-16.554667 21.922133c-1.041067 1.450667-6.229333 8.055467-1.536 10.752 4.6592 2.670933 7.560533-1.774933 8.9344-6.570666zM762.171733 783.761067l25.1392-11.554134-27.264 3.328c-1.774933 0.256-10.129067 1.109333-8.8064 6.3488 1.322667 5.213867 6.528 4.206933 10.922667 1.877334zM832 754.670933l-24.9344 11.9808 27.204267-3.797333c1.7664-0.290133 10.112-1.28 8.686933-6.510933-1.408-5.188267-6.596267-4.096-10.9568-1.681067zM810.939733 735.8208l-9.608533 25.941333 16.930133-21.623466c1.0752-1.4336 6.382933-7.936 1.732267-10.717867-4.616533-2.756267-7.594667 1.6384-9.045333 6.4zM761.198933 755.4304l26.112 9.156267-21.930666-16.554667c-1.450667-1.0496-8.046933-6.237867-10.743467-1.536-2.670933 4.6592 1.774933 7.552 6.562133 8.9344zM782.592 735.240533l11.101867 25.344-2.8416-27.323733c-0.221867-1.774933-0.930133-10.154667-6.203734-8.9088-5.230933 1.220267-4.317867 6.4512-2.056533 10.888533z" fill="#FFFFFF" p-id="6561"></path><path d="M745.719467 636.381867l28.672 60.996266-8.669867-66.3552c-0.6656-4.309333-2.909867-24.644267-15.6672-21.307733-12.672 3.328-10.112 16-4.334933 26.666667zM828.936533 909.44l-9.173333-66.773333 28.868267 60.3648c1.792 3.985067 10.9824 22.263467-1.536 26.402133-12.4416 4.1216-17.194667-7.901867-18.158934-19.9936zM667.178667 713.1136l63.402666 22.869333-53.0432-40.789333C674.005333 692.616533 658.048 679.825067 651.392 691.208533c-6.613333 11.306667 4.155733 18.4576 15.786667 21.9136zM857.873067 639.556267l-22.869334 63.402666 40.789334-53.0432c2.5856-3.524267 15.377067-19.498667 3.9936-26.154666-11.3152-6.6048-18.4576 4.164267-21.9136 15.786666zM664.1664 822.050133l61.013333-28.672-66.363733 8.669867c-4.309333 0.6656-24.6528 2.909867-21.307733 15.6672 3.328 12.672 15.991467 10.112 26.658133 4.334933zM928.708267 721.450667l-61.0048 28.672 66.3552-8.669867c4.309333-0.6656 24.6528-2.909867 21.307733-15.6672-3.328-12.672-15.991467-10.112-26.658133-4.334933zM737.749333 901.077333l21.751467-63.7952-39.8592 53.751467c-2.517333 3.566933-15.0272 19.754667-3.5328 26.2144 11.426133 6.408533 18.3808-4.48 21.640533-16.170667zM930.705067 830.737067l-63.0016-23.970134 52.334933 41.710934c3.473067 2.645333 19.217067 15.709867 26.069333 4.437333 6.8096-11.178667-3.84-18.517333-15.402666-22.186667z" fill="#FF672B" p-id="6562"></path><path d="M196.266667 846.370133a18.517333 18.517333 0 1 1-37.034667 0 18.517333 18.517333 0 0 1 37.034667 0z" fill="#E8B48C" p-id="6563"></path><path d="M198.016 906.052267c-1.570133 0.529067-3.157333 0.9984-4.736 1.408l5.3504 21.077333 4.778667-1.220267-5.393067-21.265066z m-20.7872 3.345066a61.917867 61.917867 0 0 1-4.932267-0.238933l-0.187733 21.930667 4.9408 0.0512 0.170667-21.742934z m-16.938667-2.474666a63.598933 63.598933 0 0 1-4.6848-1.5616l-6.0672 21.12 4.744534 1.365333 6.007466-20.932267z m57.634134 14.1056l-10.2912-19.157334c1.4592-0.785067 2.884267-1.621333 4.266666-2.5088l10.376534 19.328-4.352 2.338134z m3.268266-28.962134l14.967467 15.7952 3.584-3.387733-15.104-15.9488a62.976 62.976 0 0 1-3.447467 3.541333z m10.018134-12.270933l18.466133 11.605333 2.628267-4.181333-18.645334-11.716267c-0.759467 1.450667-1.578667 2.8928-2.449066 4.292267z m7.2192-16.298667l20.992 5.981867 1.3568-4.744533-21.188267-6.033067a63.488 63.488 0 0 1-1.160533 4.804267z m2.389333-16.896l21.8624 0.136534 0.034133-4.9408-22.0672-0.136534c0.128 1.646933 0.1792 3.293867 0.170667 4.932267z m-1.664-14.651733l21.333333-4.949333-1.117866-4.804267-21.538134 5.000533c0.512 1.578667 0.938667 3.157333 1.322667 4.753067z m-5.870933-15.479467l19.3536-10.350933-2.3296-4.352-19.524267 10.453333c0.878933 1.373867 1.7152 2.7904 2.500267 4.2496z m-9.6256-13.3632l16.0256-15.044266-3.3792-3.601067-16.170667 15.189333c1.211733 1.092267 2.389333 2.2528 3.524267 3.456z m-14.506667-11.434666l11.008-19.080534-4.2752-2.474666-11.101867 19.268266c1.4848 0.708267 2.944 1.467733 4.3776 2.286934z m-14.045867-5.9392l6.084267-21.179734-4.744533-1.365333-6.144 21.376c1.621333 0.3328 3.2256 0.725333 4.804266 1.169067z m-16.827733-2.440534l0.187733-22.0416-4.9408-0.042666-0.1792 22.237866c1.646933-0.110933 3.293867-0.170667 4.932267-0.1536z m-11.178667 0.913067l-5.469866-21.563733-4.778667 1.220266 5.418667 21.376c1.604267-0.4096 3.217067-0.750933 4.829866-1.032533z m-14.6944 4.437333l-10.530133-19.618133-4.352 2.338133 10.4448 19.4304c1.442133-0.768 2.9184-1.493333 4.437333-2.158933z m-14.225066 8.6272l-15.2832-16.128-3.584 3.387734 15.146666 15.991466c1.194667-1.1264 2.432-2.218667 3.720534-3.2512z m-10.939734 11.3664l-18.7904-11.810133-2.619733 4.181333 18.619733 11.690667c0.878933-1.3824 1.809067-2.7392 2.7904-4.061867z m-8.507733 15.616l-21.341867-6.084266-1.3568 4.744533 21.1456 6.033067a63.488 63.488 0 0 1 1.553067-4.693334z m-3.771733 16.597334l-22.135467-0.136534-0.034133 4.932267 21.930666 0.136533c0.008533-1.646933 0.085333-3.293867 0.238934-4.932266z m0.4352 14.737066L93.866667 860.586667l1.117866 4.804266 21.333334-4.949333a62.421333 62.421333 0 0 1-0.9216-4.855467z m4.5824 15.931734l-19.456 10.410666 2.3296 4.352 19.268266-10.308266a64.170667 64.170667 0 0 1-2.141866-4.4544z m8.507733 14.165333l-16.042667 15.061333 3.3792 3.601067 15.8976-14.9248a63.317333 63.317333 0 0 1-3.234133-3.7376z m13.5424 12.5952l-10.973867 19.0464 4.2752 2.4576 10.871467-18.858667c-1.425067-0.827733-2.816-1.706667-4.181333-2.645333zM212.548267 957.3888c-1.578667 0.4864-3.157333 0.9472-4.744534 1.373867l4.829867 18.116266 4.770133-1.28-4.864-18.210133z m-34.321067 5.307733c-1.646933 0-3.293867-0.0256-4.932267-0.093866l0.068267 18.858666 4.932267-0.017066-0.068267-18.747734z m-31.232-4.1984c-1.578667-0.443733-3.157333-0.913067-4.718933-1.416533l-5.000534 18.2272 4.753067 1.3056 4.974933-18.116267z m-26.077867-10.734933l-9.207466 16.4096-4.3008-2.4064 9.250133-16.512c1.399467 0.861867 2.816 1.706667 4.258133 2.5088z m-26.973866-20.881067a114.039467 114.039467 0 0 1-3.345067-3.6352l-13.661867 13.141334 3.413334 3.549866 13.5936-13.056z m-17.9968-24.576c-0.785067-1.4336-1.536-2.901333-2.269867-4.3776l-16.699733 9.1904 2.389333 4.3264 16.580267-9.130666z m-11.042134-28.484266a115.6608 115.6608 0 0 1-1.066666-4.8128l-18.551467 4.5312 1.169067 4.795733 18.449066-4.514133z m-3.285333-26.9568c0-1.646933 0.0256-3.293867 0.085333-4.9408l-19.131733 0.110933 0.034133 4.932267 19.012267-0.1024z m4.155733-31.146667c0.443733-1.578667 0.913067-3.157333 1.408-4.718933L48.64 805.947733l-1.288533 4.7616 18.432 5.0176z m13.038934-30.088533c0.861867-1.408 1.749333-2.7904 2.670933-4.155734l-16.426667-10.052266-2.577066 4.215466 16.3328 9.992534z m18.184533-22.698667c1.186133-1.143467 2.389333-2.269867 3.618133-3.362133l-13.422933-13.832534-3.541333 3.4304 13.346133 13.755734z m24.721067-18.261333c1.4336-0.785067 2.8928-1.544533 4.369066-2.2784l-9.344-16.913067-4.317866 2.389333 9.2928 16.810667z m26.231466-10.5472c1.595733-0.426667 3.191467-0.8192 4.795734-1.1776l-4.974934-18.670934-4.770133 1.28 4.949333 18.568534z m24.516267-3.8144c1.646933-0.0768 3.293867-0.110933 4.932267-0.119467l-0.068267-19.191467-4.932267 0.017067 0.068267 19.293867z m31.266133 2.816c1.604267 0.366933 3.2 0.768 4.7872 1.194666l5.085867-18.5088-4.7616-1.3056-5.111467 18.619734z m26.487467 9.540266c1.467733 0.7424 2.9184 1.5104 4.352 2.312534l9.3696-16.708267-4.3008-2.414933-9.4208 16.810666z m27.818667 19.584c1.194667 1.134933 2.363733 2.295467 3.498666 3.4816l13.764267-13.226666-3.413333-3.5584-13.8496 13.303466z m19.072 23.662934c0.853333 1.399467 1.672533 2.824533 2.474666 4.266666l16.682667-9.181866-2.389333-4.317867-16.768 9.233067z m12.3392 27.9296c0.4608 1.578667 0.887467 3.1744 1.28 4.7616l18.432-4.5056-1.169067-4.795734-18.542933 4.539734z m4.539733 26.811733c0.085333 1.646933 0.128 3.293867 0.136533 4.932267l18.9184-0.1024-0.0256-4.932267-19.029333 0.1024z m-2.730667 31.3344c-0.3584 1.604267-0.750933 3.2-1.186133 4.7872l18.218667 4.9664 1.297066-4.7616-18.321066-4.992z m-11.6736 30.702933c-0.7936 1.450667-1.621333 2.8672-2.474666 4.266667l16.059733 9.8304 2.568533-4.206933-16.1536-9.890134z m-17.211733 23.594667c-1.1264 1.194667-2.286933 2.363733-3.464533 3.515733l13.064533 13.4656 3.541333-3.4304-13.141333-13.550933z m-23.944533 19.370667c-1.408 0.853333-2.824533 1.681067-4.266667 2.474666l9.070933 16.4352 4.317867-2.389333-9.130667-16.512z" fill="#E8B48C" p-id="6564"></path><path d="M881.493333 147.549867a18.517333 18.517333 0 1 1-37.034666 0 18.517333 18.517333 0 0 1 37.034666 0z" fill="#E8B48C" p-id="6565"></path><path d="M883.242667 207.232c-1.570133 0.5376-3.1488 0.9984-4.736 1.408l5.3504 21.077333 4.778666-1.220266-5.393066-21.265067z m-20.7872 3.345067a62.856533 62.856533 0 0 1-4.932267-0.238934l-0.187733 21.9392 4.9408 0.042667 0.170666-21.742933z m-16.930134-2.474667a63.351467 63.351467 0 0 1-4.693333-1.5616l-6.058667 21.12 4.736 1.365333 6.016-20.923733z m57.634134 14.1056l-10.299734-19.157333a63.402667 63.402667 0 0 0 4.266667-2.5088l10.376533 19.336533-4.352 2.3296z m3.259733-28.962133l14.967467 15.803733 3.584-3.396267-15.104-15.940266a63.4624 63.4624 0 0 1-3.447467 3.5328z m10.018133-12.270934l18.474667 11.605334 2.619733-4.181334-18.6368-11.716266c-0.768 1.4592-1.578667 2.8928-2.4576 4.292266z m7.2192-16.298666l20.992 5.9904 1.3568-4.744534-21.188266-6.0416c-0.324267 1.621333-0.708267 3.217067-1.160534 4.804267z m2.389334-16.896l21.8624 0.136533 0.034133-4.932267-22.0672-0.145066c0.128 1.646933 0.187733 3.293867 0.170667 4.932266z m-1.664-14.6432l21.333333-4.949334-1.109333-4.804266-21.546667 4.992c0.512 1.578667 0.9472 3.165867 1.322667 4.7616z m-5.870934-15.479467l19.362134-10.359467-2.3296-4.352-19.5328 10.453334c0.887467 1.373867 1.723733 2.798933 2.500266 4.258133z m-9.617066-13.371733l16.0256-15.044267-3.3792-3.601067-16.1792 15.189334c1.220267 1.1008 2.389333 2.2528 3.5328 3.456z m-14.506667-11.434667l11.008-19.080533-4.283733-2.466134-11.093334 19.268267c1.4848 0.699733 2.935467 1.467733 4.369067 2.286933z m-14.0544-5.930667l6.084267-21.188266-4.744534-1.365334-6.135466 21.376c1.621333 0.3328 3.217067 0.725333 4.795733 1.1776z m-16.827733-2.440533l0.187733-22.050133-4.9408-0.042667-0.1792 22.237867c1.646933-0.110933 3.293867-0.170667 4.932267-0.145067z m-11.178667 0.904533l-5.461333-21.5552-4.795734 1.211734 5.4272 21.376c1.604267-0.4096 3.217067-0.750933 4.829867-1.024z m-14.685867 4.437334l-10.538666-19.6096-4.343467 2.3296 10.436267 19.4304c1.442133-0.768 2.9184-1.4848 4.437333-2.158934z m-14.2336 8.6272l-15.274666-16.128-3.584 3.387733 15.138133 15.991467c1.194667-1.1264 2.432-2.218667 3.720533-3.242667z m-10.9312 11.3664l-18.7904-11.810134-2.628266 4.181334 18.619733 11.6992c0.878933-1.390933 1.809067-2.747733 2.798933-4.0704z m-8.516266 15.616l-21.341867-6.084267-1.348267 4.744533 21.137067 6.033067c0.4608-1.5872 0.981333-3.157333 1.553067-4.693333z m-3.771734 16.597333l-22.135466-0.136533-0.034134 4.932266 21.930667 0.145067c0.017067-1.655467 0.093867-3.3024 0.238933-4.9408z m0.443734 14.7456l-21.5296 4.992 1.109333 4.804267 21.333333-4.949334a61.585067 61.585067 0 0 1-0.913066-4.846933z m4.573866 15.931733l-19.456 10.410667 2.3296 4.352 19.268267-10.325333a64.631467 64.631467 0 0 1-2.141867-4.437334z m8.516267 14.165334l-16.042667 15.0528 3.3792 3.601066 15.889067-14.9248a62.5664 62.5664 0 0 1-3.2256-3.7376z m13.533867 12.5952l-10.973867 19.037866 4.2752 2.466134 10.88-18.8672c-1.425067-0.827733-2.816-1.706667-4.181333-2.645334zM897.774933 258.568533c-1.578667 0.494933-3.157333 0.955733-4.736 1.373867l4.821334 18.116267 4.770133-1.28-4.855467-18.210134z m-34.312533 5.307734c-1.655467 0-3.293867-0.0256-4.9408-0.085334l0.068267 18.850134 4.932266-0.017067-0.059733-18.747733z m-31.232-4.1984a110.907733 110.907733 0 0 1-4.727467-1.416534l-5.000533 18.2272 4.7616 1.3056 4.9664-18.116266z m-26.0864-10.734934l-9.198933 16.418134-4.309334-2.414934 9.258667-16.512c1.399467 0.8704 2.816 1.706667 4.2496 2.5088z m-26.973867-20.881066a118.4256 118.4256 0 0 1-3.345066-3.6352l-13.653334 13.141333 3.413334 3.549867 13.585066-13.056z m-17.9968-24.576c-0.776533-1.4336-1.536-2.901333-2.269866-4.3776l-16.6912 9.1904 2.3808 4.3264 16.580266-9.130667z m-11.042133-28.475734a118.536533 118.536533 0 0 1-1.066667-4.821333l-18.551466 4.5312 1.169066 4.795733 18.449067-4.5056z m-3.2768-26.965333c0-1.646933 0.0256-3.293867 0.085333-4.932267l-19.131733 0.1024 0.0256 4.932267 19.0208-0.1024z m4.155733-31.138133c0.426667-1.5872 0.904533-3.157333 1.408-4.727467L733.866667 107.127467l-1.297067 4.7616 18.432 5.0176z m13.038934-30.097067c0.853333-1.399467 1.7408-2.781867 2.6624-4.155733L750.2848 72.618667l-2.568533 4.206933 16.3328 9.992533z m18.176-22.698667c1.186133-1.143467 2.389333-2.261333 3.626666-3.362133l-13.431466-13.832533-3.5328 3.438933 13.346133 13.755733z m24.721066-18.2528c1.4336-0.785067 2.8928-1.553067 4.369067-2.286933l-9.344-16.913067-4.317867 2.389334 9.2928 16.810666z m26.231467-10.555733c1.595733-0.426667 3.2-0.8192 4.795733-1.1776l-4.974933-18.6624-4.7616 1.271467 4.949333 18.568533z m24.516267-3.805867c1.646933-0.085333 3.293867-0.119467 4.932266-0.128l-0.068266-19.191466-4.932267 0.0256 0.068267 19.285333z m31.266133 2.816c1.6128 0.3584 3.208533 0.768 4.7872 1.194667l5.085867-18.517333-4.7616-1.3056-5.111467 18.619733z m26.487467 9.540267c1.467733 0.733867 2.9184 1.5104 4.352 2.304l9.378133-16.708267-4.309333-2.414933-9.4208 16.810667z m27.818666 19.575467c1.194667 1.134933 2.363733 2.295467 3.5072 3.4816l13.764267-13.226667-3.421867-3.5584-13.841066 13.312z m19.072 23.662933c0.853333 1.399467 1.681067 2.824533 2.474667 4.266667l16.682667-9.181867-2.3808-4.317867-16.776534 9.233067z m12.3392 27.9296c0.4608 1.5872 0.896 3.1744 1.288534 4.7616l18.432-4.5056-1.1776-4.7872-18.542934 4.5312z m4.539734 26.811733c0.085333 1.646933 0.128 3.293867 0.136533 4.9408l18.9184-0.110933-0.0256-4.932267-19.029333 0.1024z m-2.730667 31.3344c-0.3584 1.604267-0.750933 3.208533-1.186133 4.795734l18.2272 4.949333 1.297066-4.753067-18.3296-4.992z m-11.665067 30.711467c-0.802133 1.4336-1.621333 2.858667-2.474666 4.266667l16.042666 9.821866 2.5856-4.206933-16.1536-9.8816z m-17.220266 23.586133c-1.1264 1.194667-2.2784 2.372267-3.464534 3.515734l13.064534 13.474133 3.541333-3.438933-13.141333-13.550934z m-23.944534 19.3792c-1.399467 0.853333-2.824533 1.681067-4.266666 2.474667l9.070933 16.4352 4.317867-2.389333-9.130667-16.520534z" fill="#E8B48C" p-id="6566"></path><path d="M87.594667 547.421867c-11.844267-86.852267 19.7376-110.208 37.009066-111.035734l377.5232 22.212267v167.7824c-264.021333 86.357333-399.726933 29.610667-414.532266-78.958933z" fill="#FD2B22" p-id="6567"></path><path d="M914.722133 547.421867c11.844267-86.852267-19.7376-110.208-37.009066-111.035734l-377.514667 22.212267v167.7824c264.0128 86.357333 399.7184 29.610667 414.523733-78.958933z" fill="#FD2B22" p-id="6568"></path><path d="M355.703467 45.892267C250.350933 76.544 245.879467 200.32 257.851733 253.7984c86.1952 57.463467 149.725867 140.8768 169.685334 179.985067 63.2064-80.452267 125.303467-39.9104 148.445866-9.5744 30.651733-70.877867 131.5328-150.024533 177.834667-182.749867C748.0576 139.938133 680.533333 64.256 647.808 41.105067l-4.7872 191.547733h-45.4912l-52.676267-11.972267-45.4912-71.825066-26.3424 71.825066-45.4912 9.582934-64.648533 4.778666-7.185067-189.149866z" fill="#F5452E" p-id="6569"></path><path d="M351.616 46.532267l4.932267 32.0768c-55.2704 0-74.026667 101.981867-76.4928 152.977066l14.805333 39.483734-37.009067-29.610667c-27.639467-104.618667 50.9952-173.5424 93.764267-194.926933zM650.180267 46.532267l-4.9408 32.0768c55.278933 0 74.026667 101.981867 76.4928 152.977066l-14.805334 39.483734 37.0176-29.610667c27.630933-104.618667-50.9952-173.5424-93.764266-194.926933z" fill="#EC2606" p-id="6570"></path><path d="M129.536 438.8608V310.545067c112.520533-9.864533 240.9984 86.357333 291.165867 135.714133l-37.009067 96.2304C233.6768 639.214933 151.7568 513.706667 129.536 438.869333z" fill="#F09C78" p-id="6571"></path><path d="M176.426667 458.5984V327.816533l66.619733-19.7376C298.973867 342.621867 410.3424 418.133333 408.362667 443.793067c-1.962667 25.659733-28.782933 73.198933-41.941334 93.764266-76.987733 67.114667-158.7456-24.6784-189.994666-78.958933z" fill="#A3001C" p-id="6572"></path><path d="M235.665067 349.917867l-8.3968-3.703467-0.256 9.181867-2.474667 88.832-0.042667 1.706666 0.853334 1.501867c12.629333 22.306133 35.908267 51.259733 64.9216 64.1024 14.685867 6.5024 31.018667 8.9344 48.042666 4.0448 16.964267-4.881067 33.8944-16.836267 50.244267-37.7856l1.501867-1.92-0.221867-2.432-4.932267-54.289067-0.341333-3.618133-3.319467-1.467733-145.578666-64.1536z" fill="#941F31" p-id="6573"></path><path d="M847.573333 440.618667l-4.932266-157.2096c-112.520533-9.873067-236.0576 115.259733-286.225067 164.608l37.009067 96.238933c150.016 96.725333 231.936-28.791467 254.148266-103.637333z" fill="#F09C78" p-id="6574"></path><path d="M800.6912 460.356267V329.582933l-66.619733-19.7376C678.144 344.388267 566.784 419.8912 568.7552 445.550933c1.962667 25.668267 28.782933 73.207467 41.941333 93.764267 76.987733 67.114667 158.7456-24.669867 189.994667-78.958933z" fill="#A3001C" p-id="6575"></path><path d="M741.461333 351.684267l8.3968-3.703467 0.256 9.173333 2.4576 88.832 0.0512 1.706667-0.8448 1.501867c-12.629333 22.314667-35.925333 51.259733-64.930133 64.1024-14.685867 6.5024-31.018667 8.942933-48.042667 4.0448-16.964267-4.881067-33.8944-16.836267-50.244266-37.777067l-1.501867-1.928533 0.221867-2.432 4.932266-54.280534 0.341334-3.618133 3.319466-1.467733 145.578667-64.1536z" fill="#941F31" p-id="6576"></path><path d="M208.469333 789.9392l-2.432-87.569067 594.653867-11.8272v101.76c-18.688 43.400533-101.376 130.176-282.709333 130.176-181.316267 0-281.890133-88.354133-309.504-132.539733z" fill="#F5211D" p-id="6577"></path><path d="M229.418667 704.247467l-4.881067 1.041066V783.752533l1.083733 1.578667c28.330667 41.198933 124.561067 120.174933 286.532267 116.1728 161.877333-3.9936 238.762667-83.387733 257.160533-124.561067l0.443734-0.9984 0.085333-1.083733 4.923733-71.560533 0.452267-6.485334-6.5024-0.110933c-78.165333-1.2288-198.877867-2.338133-306.9696-1.664-54.0416 0.341333-104.968533 1.1264-145.8688 2.577067-40.6528 1.4336-72.004267 3.5328-86.459733 6.6304z" fill="#F0CA4D" p-id="6578"></path><path d="M83.882667 300.535467L59.938133 147.285333c185.8048 36.394667 321.646933 208.3072 366.336 289.723734 61.294933-80.452267 126.1056-39.9104 150.843734-9.582934 72.789333-158.984533 277.751467-246.613333 371.131733-270.5664l-35.925333 126.907734c-67.029333-17.237333-241.8176 130.090667-320.836267 205.909333-72.789333 109.184-148.4544 47.095467-177.186133 2.389333-68.949333-93.8496-249.002667-166.801067-330.410667-191.5392z" fill="#FFD775" p-id="6579"></path><path d="M13.568 512.878933l69.0944 49.348267c128.3072 82.909867 296.917333 54.289067 365.184 29.610667 33.553067-17.7664 83.072-9.045333 103.637333-2.466134 59.221333 49.348267 248.388267 32.085333 335.573334 17.271467 37.504-9.864533 97.877333-60.040533 123.374933-83.8912-1.979733 73.0368-81.4336 143.931733-120.9088 170.257067-175.189333 49.348267-562.5856 19.7376-688.426667 12.330666C100.437333 699.4176 34.133333 574.5664 13.568 512.878933z" fill="#FFD775" p-id="6580"></path><path d="M470.050133 221.7216l-34.542933 12.330667c41.454933 69.0944 122.555733 30.4384 157.917867 2.474666l-44.416-9.873066-51.8144-74.026667-27.136 69.0944z" fill="#EC2606" p-id="6581"></path><path d="M413.303467 606.6432c32.0768-21.384533 111.035733-51.319467 170.257066 0H413.303467z" fill="#FFF3D5" p-id="6582"></path><path d="M346.683733 742.638933V708.096c61.678933 14.805333 123.3664 9.864533 157.917867-7.406933 32.0768 24.6784 111.854933 16.452267 140.637867 9.873066l-2.466134 34.542934c-112.512 98.696533-244.2752 39.4752-296.0896-2.474667z" fill="#FB341D" p-id="6583"></path>
        </symbol>`)

        this.registerTopbarIcon();

        this.addCommand({
            langKey: "reload",
            hotkey: "⇧⌘R",
            callback: () => {
                window.location.reload();
            }
        });

        const plugin = this;

        this.addTab({
            type: TAB_TYPE,
            init() {
                new Tab({
                    target: this.element,
                    props: {
                        username: plugin.config.username,
                        plugin,
                    }
                }).$on('update', (e) => {
                    console.log(e.detail);
                    plugin.setUsername(e.detail)
                })
            }
        });
    }

    registerTopbarIcon() {
        const topBarElement = this.addTopBar({
            title: this.i18n.title,
            icon: 'iconDevtools',
            position: 'right',
            callback: () => {
                if (this.isMobile) {
                    this.addMenu(null);
                } else {
                    let rect = topBarElement.getBoundingClientRect();
                    // 如果被隐藏，则使用更多按钮
                    if (rect.width === 0) {
                        rect = document.querySelector("#barMore").getBoundingClientRect();
                    }
                    if (rect.width === 0) {
                        rect = document.querySelector("#barPlugins").getBoundingClientRect();
                    }
                    this.addMenu(rect);
                }
            },
        });
    }

    addMenu(rect) {
        const menu = new Menu("siyuanPluginDevtool");
        menu.addItem({
            icon: "iconRefresh",
            label: this.i18n.reload,
            click: () => window.location.reload(),
        });
        if (window.require) {
            menu.addItem({
                icon: 'iconFolder',
                label: this.i18n.openPluginFolder,
                click: () => this.showPluginFolder(),
            });
        }
        menu.addItem({
            icon: "iconDevtools",
            label: this.i18n.developerPanel,
            click: () => this.showDevTool(),
        });
        menu.addSeparator();
        if (window.require) {
            menu.addItem({
                icon: 'iconBug',
                label: this.i18n.openElectronDevTools,
                click: () => this.openElectronDevTools(),
            })
        }
        if (true) {
            menu.addItem({
                icon: "iconBug",
                label: this.i18n.vConsole,
                click: () => {
                    this.toggleVconsole(undefined);
                    this.saveConfig();
                }
            })
        }
        if (this.isMobile) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                isLeft: true,
            });
        }

    }

    toggleVconsole(initial) {
        if (initial === false) {
            return;
        }
        if (this.VConsole) {
            this.VConsole.destroy();
            this.VConsole = null;
            this.config.vconsole = false;
        } else {
            this.VConsole = new VConsole();
            this.config.vconsole = true;
        }
    }

    showDevTool() {
        openTab({
            app: this.app,
            custom: {
                icon: 'iconDevtools',
                title: this.i18n.developerPanel,
                data: {},
                id: this.name + TAB_TYPE,
            },
        });
    }

    openElectronDevTools() {
        if (!window.require) {
            return;
        }
        const remote = window.require('@electron/remote');
        remote?.getCurrentWindow().webContents.openDevTools()
    }

    showPluginFolder() {
        if (!window.require) {
            return;
        }
        const path = window.require('path');
        const { shell } = window.require('@electron/remote') // deconstructing assignment
        const absPath = path.join((window.siyuan as any).config.system.workspaceDir, 'data', 'plugins')
        // shell.showItemInFolder(absPath);
        shell.openExternal('file://' + encodeURI(absPath));
    }

    async setUsername(username) {
        this.config.username = username;
        this.saveConfig();
    }

    async saveConfig() {
        await this.saveData('config.json', JSON.stringify(this.config));
    }

    async loadConfig() {
        this.config = await this.loadData('config.json');
        if (!this.config) {
            this.config = {
                'username': '',
                'vconsole': false,
            };
            this.saveConfig();
        }
    }
}