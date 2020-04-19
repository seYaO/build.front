// var VRUtil = require('./_util.js');

var View360 = function () {
    this.imgUrl = 'http://pic4.40017.cn/cruises/2016/12/13/10/KczVD2.jpg';
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.isGryo = false;
    this.controls = null; //webvr控制器
    this.effect = null;
    this.isHideBtn = false; //true:隐藏按钮；false:显示按钮
    this.init();
}

View360.prototype = {
    init: function () {
        //初始化参数
        this.imgUrl = VRUtil.GetQueryString('imgUrl') || this.imgUrl;
        //设置title
        if (VRUtil.GetQueryString('title')) {
            $('title').html(VRUtil.GetQueryString('title'));
        }
        //是否进入陀螺仪
        if (VRUtil.GetQueryString('isGryo')) {
            this.isGryo = VRUtil.GetQueryString('isGryo') == 1 ? true : false;
        }
        //是否显示按钮
        if (VRUtil.GetQueryString('isHideBtn')) {
            this.isHideBtn = VRUtil.GetQueryString('isHideBtn') == 1 ? true : false;
        }

        this.controlBtns();


        //初始化场地
        this.scene = new THREE.Scene();

        //初始化摄像机
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 0.0001;
        this.camera.layers.enable(1);

        //初始化渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0xffffff);
        document.body.appendChild(this.renderer.domElement);

        //初始化全景场景
        this.geometry = new THREE.SphereGeometry(50, 200, 200); //球型
        this.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        //初始化分屏器
        this.effect = new THREE.VREffect(this.renderer);

        //初始化控制器
        this.initControls();

        this.initTexture();

        //绑定事件
        this.bindEvent();
    },
    initTexture: function () {
        var that = this;
        //添加全景图片
        //初始化材质
        THREE.TextureLoader.prototype.crossOrigin = 'anonymous';
        var loader = new THREE.TextureLoader();
        loader.load(
            that.imgUrl,
            function (texture) {
                texture.mapping = THREE.UVMapping;
                if (!that.mesh) {
                    that.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        transparent: true,
                        map: texture
                    });
                }
                that.material.map.minFilter = THREE.LinearFilter;
                that.mesh = new THREE.Mesh(that.geometry, that.material);
                that.scene.add(that.mesh);
                that.animate();
                // $('.loading').fadeOut();
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (xhr) {
                console.log('An error happened');
                // $('.dialog-confirm').fadeIn();
                // $('.confirm-btn-confirm').on('click touchtap', function () {
                //     that.initTexture();
                // })
            }
        );
    },
    initControls: function () {
        //初始化控制器
        if (this.isGryo) {
            //初始化控制器
            this.controls = new THREE.VRControls(this.camera);
            this.controls.standing = true;
        } else {
            this.controls = new THREE.OrbitControls(this.camera);
            this.controls.rotateSpeed = -0.5;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.3;
            this.controls.enableZoom = false;
            this.controls.enablePan = false;
        }
    },
    animate: function () {
        var that = this;
        that.controls.update();
        that.effect.render(this.scene, this.camera);
        that.effect.requestAnimationFrame(function () {
            that.animate();
        });
        // that.renderer.render(that.scene,that.camera);
        // requestAnimationFrame(function(){
        //     that.animate();
        // })

    },
    bindEvent: function () {
        var that = this;
        //窗口大小调整
        window.addEventListener('resize', function () {
            that.camera.aspect = window.innerWidth / window.innerHeight;
            that.camera.updateProjectionMatrix();

            that.effect.setSize(window.innerWidth, window.innerHeight);
            //重新初始化控制器
            that.initControls();
        }, false);

        $('.btn-vr').click(function () {
            that.enterVR();
        });

        $('.btn-fs').click(function () {
            that.enterFullScreen();
        });

        $('.btn-gryo').click(function () {
            that.enterGryo();
        });

        $('.btn-back').click(function () {
            history.go(-1);
        });
    },
    enterVR: function () {
        //进入VR模式
        var that = this;
        that.effect.isPresenting ? that.effect.exitPresent() : that.effect.requestPresent();
        that.isGryo = that.effect.isPresenting ? false : true;
        that.initControls();
    },
    enterFullScreen: function () {
        //进入全屏模式
    },
    enterGryo: function () {
        //进入陀螺仪模式
        this.isGryo = !this.isGryo;
        this.initControls();
    },
    controlBtns: function () {
        //界面显示按钮控制，如果不支持便不显示或通过配置设置

        $('.btn-box').css('display',this.isHideBtn? 'block':'none');
        //临时设置
        $('.btn-vr,.btn-fs').parent().css('display','none');
    },

}

new View360();