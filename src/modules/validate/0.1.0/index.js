define("validate/0.1.0/index", ["base/0.1.0/base", 'validate/0.1.0/rules','validate/0.1.0/theme/default.css'], function (require) {
    /*
    * validate (输入验证组件)
    * Created by 李岩岩 on 2016/2.1
    * events:failure,success,show,hide
    */   
    var validate = Base.extend({
        initialize: function (config) {
            validate.superclass.initialize.apply(this, arguments);
            this.init(config);
        },
        init: function (conf) {
            var self = this;
            self.allRules = allRules;
            self.options = this.get("options");
            $.extend(self.options, conf);
            self.options.allrules = allRules;
            self.validateAttribute = self.options.validateAttribute;

            //为生成提示框增加的id自编号
            this.fieldIdCounter = 0;

            //点击提示框关闭
            $(document).on("click", ".formError", function () {
                var obj = this;
                $(this).fadeOut(150, function () {
                    // remove prompt once invisible
                    self.trigger("hide", $(this).closest('.formError').next());
                    $(this).closest('.formError').remove();
                });
            });
        },
        ATTRS: {
            warpper: document,
            options: { // Name of the event triggering field validation
                validationEventTrigger: "blur",
                // Automatically scroll viewport to the first error
                scroll: true,
                // Focus on the first input
                focusFirstField: true,
                // Show prompts, set to false to disable prompts
                showPrompts: true,
                // Should we attempt to validate non-visible input fields contained in the form? (Useful in cases of tabbed containers, e.g. jQuery-UI tabs)
                validateNonVisibleFields: false,
                // ignore the validation for fields with this specific class (Useful in cases of tabbed containers AND hidden fields we don't want to validate)
                ignoreFieldsWithClass: 'ignoreMe',
                // Opening box position, possible locations are: topLeft,
                // topRight, bottomLeft, centerRight, bottomRight, inline
                // inline gets inserted after the validated field or into an element specified in data-prompt-target
                //new add rightTop
                promptPosition: "topRight",
                bindMethod: "bind",
                // internal, automatically set to true when it parse a _ajax rule
                inlineAjax: false,
                // if set to true, the form data is sent asynchronously via ajax to the form.action url (get)
                ajaxFormValidation: false,
                // The url to send the submit ajax validation (default to action)
                ajaxFormValidationURL: false,
                // HTTP method used for ajax validation
                ajaxFormValidationMethod: 'get',
                // Ajax form validation callback method: boolean onComplete(form, status, errors, options)
                // retuns false if the form.submit event needs to be canceled.
                onAjaxFormComplete: $.noop,
                // called right before the ajax call, may return false to cancel
                onBeforeAjaxFormValidation: $.noop,
                // Stops form from submitting and execute function assiciated with it
                onValidationComplete: false,

                // Used when you have a form fields too close and the errors messages are on top of other disturbing viewing messages
                doNotShowAllErrosOnSubmit: false,
                // Object where you store custom messages to override the default error messages
                custom_error_messages: {},
                // true if you want to validate the input fields on blur event
                binded: true,
                // set to true if you want to validate the input fields on blur only if the field it's not empty
                notEmpty: false,
                // set to true, when the prompt arrow needs to be displayed
                showArrow: true,
                // set to false, determines if the prompt arrow should be displayed when validating
                // checkboxes and radio buttons
                showArrowOnRadioAndCheckbox: false,
                // did one of the validation fail ? kept global to stop further ajax validations
                isError: false,
                // Limit how many displayed errors a field can have
                maxErrorsPerField: false,

                // Caches field validation status, typically only bad status are created.
                // the array is used during ajax form validation to detect issues early and prevent an expensive submit
                ajaxValidCache: {},
                // Auto update prompt position after window resize
                autoPositionUpdate: false,

                InvalidFields: [],
                onFieldSuccess: false,
                onFieldFailure: false,
                onSuccess: false,
                onFailure: false,
                validateAttribute: "class",
                addSuccessCssClassToField: "",
                addFailureCssClassToField: "",

                // Auto-hide prompt
                autoHidePrompt: false,
                // Delay before auto-hide
                autoHideDelay: 10000,
                // Fade out duration while hiding the validations
                fadeDuration: 300,
                // Use Prettify select library
                prettySelect: false,
                // Add css class on prompt
                addPromptClass: "",
                // Custom ID uses prefix
                usePrefix: "",
                // Custom ID uses suffix
                useSuffix: "",
                // Only show one message per error prompt
                showOneMessage: false
            }           
        },
        EVENTS: {           
        },
        DOCEVENTS: {
        },
        METHODS: {
            test: function (key, value) {
                var k, v;
                if (arguments.length == 1) {
                    //key为容器对象或者选择器,自己获取key与value          
                    return !this._validateField(key);
                }
                else if (arguments.length >= 2) {
                    k = key;
                    v = value;
                }
                else {
                    return false;
                };
                return this._validate(k, v);
            },
            /*
             * 添加监视
             * @param userOptions 
             * 
             *
             */
            attach: function (warpper) {               
                var self = this;
                var options = self.options;                
                //options.validateAttribute = (self.find("[data-validation-engine*=validate]").length) ? "data-validation-engine" : "class";
                var form = $(warpper);

                if (options.binded) {
                    // delegate fields
                    form.on(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", function (event) {
                        self._onFieldEvent(event, this);
                    });
                    if (options.validationEventTrigger=="blur") {
                        form.on("focus", "[" + options.validateAttribute + "*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", function (event) {
                            self._closePrompt($(this));
                        });
                    }
                    form.on("click", "[" + options.validateAttribute + "*=validate][type=checkbox],[" + options.validateAttribute + "*=validate][type=radio]", function (event) {
                        self._onFieldEvent(event, this);
                    });
                    form.on(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate][class*=datepicker]", { "delay": 300 }, function (event) {
                        self._onFieldEvent(event, this);
                    });
                }

                //if (options.autoPositionUpdate) {
                //    $(window).bind("resize", {
                //        "noAnimation": true,
                //        "formElem": form
                //    }, methods.updatePromptsPosition);
                //}
                //form.on("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
                //form.removeData('jqv_submitButton');
                // bind form.submit
                //form.on("submit", methods._onSubmitEvent);
                return this;
            },       
           /*
            * 移除监视
            */
            detach: function (warpper) {
                var self = this;              
                var options = self.options;
                var form = $(warpper);
                // unbind fields
                form.off(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", self._onFieldEvent);
                form.off("click", "[" + options.validateAttribute + "*=validate][type=checkbox],[" + options.validateAttribute + "*=validate][type=radio]", self._onFieldEvent);
                form.off(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate][class*=datepicker]", self._onFieldEvent);

                // unbind form.submit
                form.off("submit", self._onSubmitEvent);
                form.removeData('jqv');

                form.off("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", this._submitButtonClick);
                form.removeData('jqv_submitButton');

                if (options.autoPositionUpdate)
                    $(window).off("resize", self.updatePromptsPosition);

                return this;
            },
            /*
             * 
             */
            validate: function (el,userOptions) {
                var self = this;
                var element;
                if (arguments.length == 0) {                    
                    element = self.get("warpper");
                }
                else if (arguments.length == 1) {
                    element = $(el);
                    //userOptions = self.options;
                }
                else {
                    element = $(el);
                    $.extend(self.options, userOptions);
                };
            
                var valid = null;
                var options = self.options;
               
                if (element.hasClass('validating')) {
                    // form is already validating.
                    // Should abort old validation and start new one. I don't know how to implement it.
                    return false;
                } else {
                    element.addClass('validating');
                    if (element.attr(self.validateAttribute).indexOf("validate") > -1) {
                        valid = self._validateField(element);
                    }
                    else if (element.has("[" + self.validateAttribute + "*=validate]")) {
                        valid = self._validateFields(element);
                    }
                    else {
                        valid = false;
                    }
                    // If the form doesn't validate, clear the 'validating' class before the user has a chance to submit again
                    setTimeout(function () {
                        element.removeClass('validating');
                    }, 100);
                    if (valid && options.onSuccess) {
                        options.onSuccess();
                    } else if (!valid && options.onFailure) {
                        options.onFailure();
                    }
                };

                //暂时无用移除
                //if (options.onValidationComplete) {
                //    // !! ensures that an undefined return is interpreted as return false but allows a onValidationComplete() to possibly return true and have form continue processing
                //    return !!options.onValidationComplete(form, valid);
                //}
                return valid;
            },           
            closePrompt: function (field) {
                return this._closePrompt(field);
            },
            /**
		* Displays a prompt on a element.
		* Note that the element needs an id!
		*
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {String} possible values topLeft, topRight, bottomLeft, centerRight, bottomRight
		*/
            showPrompt: function (promptText, type, promptPosition, showArrow) {
                var form = this.closest('form, .validationEngineContainer');
                var options = form.data('jqv');
                // No option, take default one
                if (!options)
                    options = this._saveOptions(this, options);
                if (promptPosition)
                    options.promptPosition = promptPosition;
                options.showArrow = showArrow == true;

                this._showPrompt(this, promptText, type, false, options);
                return this;
            },
            /**
            * Closes form error prompts, CAN be invidual
            */
            hide: function () {
                var form = $(this).closest('form, .validationEngineContainer');
                var options = form.data('jqv');
                // No option, take default one
                if (!options)
                    options = this._saveOptions(form, options);
                var fadeDuration = (options && options.fadeDuration) ? options.fadeDuration : 0.3;
                var closingtag;

                if (form.is("form") || form.hasClass("validationEngineContainer")) {
                    closingtag = "parentForm" + this._getClassName($(form).attr("id"));
                } else {
                    closingtag = this._getClassName($(form).attr("id")) + "formError";
                }
                $('.' + closingtag).fadeTo(fadeDuration, 0, function () {
                    $(this).closest('.formError').remove();
                });
                return this;
            },
            /**
            * Closes all error prompts on the page
            */
            hideAll: function () {
                var form = this;
                var options = form.data('jqv');
                var duration = options ? options.fadeDuration : 300;
                $('.formError').fadeTo(duration, 0, function () {
                    $(this).closest('.formError').remove();
                });
                return this;
            }
        },
        /**
		* Saves the user options and variables in the form.data
		*
		* @param {jqObject}
		*            form - the form where the user option should be saved
		* @param {Map}
		*            options - the user options
		* @return the user options (extended from the defaults)
		*/
        _saveOptions: function (options) {
            return $.extend(self.options, options);
        },
        _validateFields: function (warpper) {
            var self = this;
            var $list = $(warpper).find("[" + self.validateAttribute + "*=validate]");
            var isok = true;
            for (var i = 0; i < $list.length; i++) {
                var _isok = self._validateField($list.eq(i));
                if (!_isok) {
                    isok = false;
                }
            }
            //$list.each(function () {
            //    var _isok = self._validateField($(this));
            //    if (!_isok) {
            //        isok = false;
            //    }
            //});
            return isok;
        },
        _validateField: function (field) {
            //var $el = $(field);
            //var str = $el.attr("class");
            //var valis = /validate\[(.*)\]/.exec(str);
            //if (valis.length<2) {
            //    return false;
            //}
            //var k = valis[1];
            //var v = $el.val();
            //return this._validate(k, v);
            var self = this;
            var options = this.options;
            if (!field.attr("id")) {
                field.attr("id", "form-validation-field-" + self.fieldIdCounter);
                ++self.fieldIdCounter;
            }

            if (field.hasClass(options.ignoreFieldsWithClass))
                return false;

            if (!options.validateNonVisibleFields && (field.is(":hidden") && !options.prettySelect || field.parent().is(":hidden")))
                return false;

            var rulesParsing = field.attr(options.validateAttribute);
            var getRules = /validate\[(.*)\]/.exec(rulesParsing);

            if (!getRules)
                return false;
            var str = getRules[1];
            var rules = str.split(/\[|,|\]/);
            var form = $(field.closest("form, .validationEngineContainer"));
            // true if we ran the ajax validation, tells the logic to stop messing with prompts
            var isAjaxValidator = false;
            var fieldName = field.attr("name");
            var promptText = "";
            var promptType = "";
            var required = false;
            var limitErrors = false;
            options.isError = false;
            options.showArrow = true;

            // If the programmer wants to limit the amount of error messages per field,
            if (options.maxErrorsPerField > 0) {
                limitErrors = true;
            }
                   
            // Fix for adding spaces in the rules
            for (var i = 0; i < rules.length; i++) {
                rules[i] = rules[i].toString().replace(" ", "");//.toString to worked on IE8
                // Remove any parsing errors
                if (rules[i] === '') {
                    delete rules[i];
                }
            }

            // #region 源代码写的太繁琐,准备重写

            for (var i = 0, field_errors = 0; i < rules.length; i++) {

                // If we are limiting errors, and have hit the max, break
                if (limitErrors && field_errors >= options.maxErrorsPerField) {
                    // If we haven't hit a required yet, check to see if there is one in the validation rules for this
                    // field and that it's index is greater or equal to our current index
                    if (!required) {
                        var have_required = $.inArray('required', rules);
                        required = (have_required != -1 && have_required >= i);
                    }
                    break;
                }


                var errorMsg = undefined;
                switch (rules[i]) {

                    case "required":
                        required = true;
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._required);
                        break;
                    case "custom":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._custom);
                        break;
                    case "groupRequired":
                        // Check is its the first of group, if not, reload validation with first field
                        // AND continue normal validation on present field
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        var firstOfGroup = form.find(classGroup).eq(0);
                        if (firstOfGroup[0] != field[0]) {

                            self._validateField(firstOfGroup, options, skipAjaxValidation);
                            options.showArrow = true;

                        }
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._groupRequired);
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;
                    case "ajax":
                        // AJAX defaults to returning it's loading message
                        errorMsg = self._ajax(field, rules, i, options);
                        if (errorMsg) {
                            promptType = "load";
                        }
                        break;
                    case "minSize":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._minSize);
                        break;
                    case "maxSize":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._maxSize);
                        break;
                    case "min":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._min);
                        break;
                    case "max":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._max);
                        break;
                    case "past":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._past);
                        break;
                    case "future":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._future);
                        break;
                    case "dateRange":
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        options.firstOfGroup = form.find(classGroup).eq(0);
                        options.secondOfGroup = form.find(classGroup).eq(1);

                        //if one entry out of the pair has value then proceed to run through validation
                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._dateRange);
                        }
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;

                    case "dateTimeRange":
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        options.firstOfGroup = form.find(classGroup).eq(0);
                        options.secondOfGroup = form.find(classGroup).eq(1);

                        //if one entry out of the pair has value then proceed to run through validation
                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._dateTimeRange);
                        }
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;
                    case "maxCheckbox":
                        field = $(form.find("input[name='" + fieldName + "']"));
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._maxCheckbox);
                        break;
                    case "minCheckbox":
                        field = $(form.find("input[name='" + fieldName + "']"));
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._minCheckbox);
                        break;
                    case "equals":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._equals);
                        break;
                    case "funcCall":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._funcCall);
                        break;
                    case "creditCard":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._creditCard);
                        break;
                    case "condRequired":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._condRequired);
                        if (errorMsg !== undefined) {
                            required = true;
                        }
                        break;
                    case "funcCallRequired":
                        errorMsg = self._getErrorMessage(form, field, rules[i], rules, i, options, self._funcCallRequired);
                        if (errorMsg !== undefined) {
                            required = true;
                        }
                        break;

                    default:
                }

                var end_validation = false;

                // If we were passed back an message object, check what the status was to determine what to do
                if (typeof errorMsg == "object") {
                    switch (errorMsg.status) {
                        case "_break":
                            end_validation = true;
                            break;
                            // If we have an error message, set errorMsg to the error message
                        case "_error":
                            errorMsg = errorMsg.message;
                            break;
                            // If we want to throw an error, but not show a prompt, return early with true
                        case "_error_no_prompt":
                            return true;
                            break;
                            // Anything else we continue on
                        default:
                            break;
                    }
                }

                //funcCallRequired, first in rules, and has error, skip anything else
                if (i == 0 && str.indexOf('funcCallRequired') == 0 && errorMsg !== undefined) {
                    if (promptText != '') {
                        promptText += "<br/>";
                    }
                    promptText += errorMsg;                   
                    options.isError = true;
                    field_errors++;
                    end_validation = true;
                    if (options.showOneMessage) {
                        break;
                    }
                }

                // If it has been specified that validation should end now, break
                if (end_validation) {
                    break;
                }

                // If we have a string, that means that we have an error, so add it to the error message.
                if (typeof errorMsg == 'string') {
                    if (promptText != '') {
                        promptText += "<br/>";
                    }
                    //var custommsg = field.attr("data-prompt-message");
                    //if (custommsg && custommsg.indexOf(promptText)) {

                    //}                    
                    promptText += errorMsg;
                    options.isError = true;
                    field_errors++;
                    if (options.showOneMessage) {
                        break;
                    }
                }
            }        

            // #endregion


            // If the rules required is not added, an empty field is not validated
            //the 3rd condition is added so that even empty password fields should be equal
            //otherwise if one is filled and another left empty, the "equal" condition would fail
            //which does not make any sense
            if (!required && !(field.val()) && field.val().length < 1 && $.inArray('equals', rules) < 0) options.isError = false;

            // Hack for radio/checkbox group button, the validation go into the
            // first radio/checkbox of the group
            var fieldType = field.prop("type");
            var positionType = field.data("promptPosition") || options.promptPosition;

            if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").size() > 1) {
                if (positionType === 'inline') {
                    field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:last"));
                } else {
                    field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
                }
                options.showArrow = options.showArrowOnRadioAndCheckbox;
            }

            if (field.is(":hidden") && options.prettySelect) {
                field = form.find("#" + options.usePrefix + self._jqSelector(field.attr('id')) + options.useSuffix);
            }

            if (options.isError && options.showPrompts) {
                self._showPrompt(field, promptText, promptType, false, options);
            } else {
                if (!isAjaxValidator) self._closePrompt(field);
            }

            if (!isAjaxValidator) {
                field.trigger("jqv.field.result", [field, options.isError, promptText]);
            }

            /* Record error */
            var errindex = $.inArray(field[0], options.InvalidFields);
            if (errindex == -1) {
                if (options.isError)
                    options.InvalidFields.push(field[0]);
            } else if (!options.isError) {
                options.InvalidFields.splice(errindex, 1);
            }

            this._handleStatusCssClasses(field, options);

            /* run callback function for each field */
            if (options.isError) {
                self.trigger("failure", field);
                if (options.onFieldFailure) {
                    options.onFieldFailure(field);
                }
            }

            if (!options.isError) {
                self.trigger("success", field);
                if (options.onFieldSuccess) {
                    options.onFieldSuccess(field);
                }
            }
            return !options.isError;
        },
        _validate: function (key,value) {
            var vali = self.allRules[key];
            if (vali) {
                return vali.regex.test(value);
            }
            else {
                return false;
            }
        },
        /**
    * Builds or updates a prompt with the given information
    *
    * @param {jqObject} field
    * @param {String} promptText html text to display type
    * @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
    * @param {boolean} ajaxed - use to mark fields than being validated with ajax
    * @param {Map} options user options
    */
        _showPrompt: function (field, promptText, type, ajaxed, options, ajaxform) {          
            //Check if we need to adjust what element to show the prompt on
            if (field.data('jqv-prompt-at') instanceof jQuery) {
                field = field.data('jqv-prompt-at');
            } else if (field.data('jqv-prompt-at')) {
                field = $(field.data('jqv-prompt-at'));
            }

            var prompt = this._getPrompt(field);
            // The ajax submit errors are not see has an error in the form,
            // When the form errors are returned, the engine see 2 bubbles, but those are ebing closed by the engine at the same time
            // Because no error was found befor submitting
            if (ajaxform) prompt = false;
            // Check that there is indded text
            if ($.trim(promptText)) {
                this.trigger("show", field, promptText);
                if (prompt)
                    this._updatePrompt(field, prompt, promptText, type, ajaxed, options);
                else
                    this._buildPrompt(field, promptText, type, ajaxed, options);
            }
        },
        /**
		* Builds and shades a prompt for the given field.
		*
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
        _buildPrompt: function (field, promptText, type, ajaxed, options) {

            // create the prompt
            var prompt = $('<div>');
            prompt.addClass(this._getClassName(field.attr("id")) + "formError");
            // add a class name to identify the parent form of the prompt
            prompt.addClass("parentForm" + this._getClassName(field.closest('form, .validationEngineContainer').attr("id")));
            prompt.addClass("formError");

            switch (type) {
                case "pass":
                    prompt.addClass("greenPopup");
                    break;
                case "load":
                    prompt.addClass("blackPopup");
                    break;
                default:
                    /* it has error  */
                    //alert("unknown popup type:"+type);
            }
            if (ajaxed)
                prompt.addClass("ajaxed");

            // create the prompt content
            var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);

            // determine position type
            var positionType = field.data("promptPosition") || options.promptPosition;

            // create the css arrow pointing at the field
            // note that there is no triangle on max-checkbox and radio
            if (options.showArrow) {
                var arrow = $('<div>').addClass("formErrorArrow");

                //prompt positioning adjustment support. Usage: positionType:Xshift,Yshift (for ex.: bottomLeft:+20 or bottomLeft:-20,+10)
                if (typeof (positionType) == 'string') {
                    var pos = positionType.indexOf(":");
                    if (pos != -1)
                        positionType = positionType.substring(0, pos);
                }

                switch (positionType) {
                    case "bottomLeft":
                    case "bottomRight":
                        prompt.find(".formErrorContent").before(arrow);
                        arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                        break;
                    case "topLeft":
                    case "topRight":
                        arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                        prompt.append(arrow);
                        break;
                }
            }
            // Add custom prompt class
            if (options.addPromptClass)
                prompt.addClass(options.addPromptClass);

            // Add custom prompt class defined in element
            var requiredOverride = field.attr('data-required-class');
            if (requiredOverride !== undefined) {
                prompt.addClass(requiredOverride);
            } else {
                if (options.prettySelect) {
                    if ($('#' + field.attr('id')).next().is('select')) {
                        var prettyOverrideClass = $('#' + field.attr('id').substr(options.usePrefix.length).substring(options.useSuffix.length)).attr('data-required-class');
                        if (prettyOverrideClass !== undefined) {
                            prompt.addClass(prettyOverrideClass);
                        }
                    }
                }
            }

            prompt.css({
                "opacity": 0
            });
            if (positionType === 'inline') {
                prompt.addClass("inline");
                if (typeof field.attr('data-prompt-target') !== 'undefined' && $('#' + field.attr('data-prompt-target')).length > 0) {
                    prompt.appendTo($('#' + field.attr('data-prompt-target')));
                } else {
                    field.after(prompt);
                }
            } else {
                field.before(prompt);
            }

            var pos = this._calculatePosition(field, prompt, options);
            // Support RTL layouts by @yasser_lotfy ( Yasser Lotfy )
            if ($('body').hasClass('rtl')) {
                prompt.css({
                    'position': positionType === 'inline' ? 'relative' : 'absolute',
                    "top": pos.callerTopPosition,
                    "left": "initial",
                    "right": pos.callerleftPosition,
                    "marginTop": pos.marginTopSize,
                    "opacity": 0
                }).data("callerField", field);
            } else {
                prompt.css({
                    'position': positionType === 'inline' ? 'relative' : 'absolute',
                    "top": pos.callerTopPosition,
                    "left": pos.callerleftPosition,
                    "right": "initial",
                    "marginTop": pos.marginTopSize,
                    "opacity": 0
                }).data("callerField", field);
            }


            if (options.autoHidePrompt) {
                setTimeout(function () {
                    prompt.animate({
                        "opacity": 0
                    }, function () {
                        prompt.closest('.formError').remove();
                    });
                }, options.autoHideDelay);
            }
            return prompt.animate({
                "opacity": 0.87
            });
        },
        /**
		* Updates the prompt text field - the field for which the prompt
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
        _updatePrompt: function (field, prompt, promptText, type, ajaxed, options, noAnimation) {

            if (prompt) {
                if (typeof type !== "undefined") {
                    if (type == "pass")
                        prompt.addClass("greenPopup");
                    else
                        prompt.removeClass("greenPopup");

                    if (type == "load")
                        prompt.addClass("blackPopup");
                    else
                        prompt.removeClass("blackPopup");
                }
                if (ajaxed)
                    prompt.addClass("ajaxed");
                else
                    prompt.removeClass("ajaxed");

                prompt.find(".formErrorContent").html(promptText);

                var pos = this._calculatePosition(field, prompt, options);
                // Support RTL layouts by @yasser_lotfy ( Yasser Lotfy )
                if ($('body').hasClass('rtl')) {
                    var css = {
                        "top": pos.callerTopPosition,
                        "left": "initial",
                        "right": pos.callerleftPosition,
                        "marginTop": pos.marginTopSize,
                        "opacity": 0.87
                    };
                } else {
                    var css = {
                        "top": pos.callerTopPosition,
                        "left": pos.callerleftPosition,
                        "right": "initial",
                        "marginTop": pos.marginTopSize,
                        "opacity": 0.87
                    };
                }

                prompt.css({
                    "opacity": 0,
                    "display": "block"
                });

                if (noAnimation)
                    prompt.css(css);
                else
                    prompt.animate(css);
            }
        },
        /**
		* Calculates prompt position
		*
		* @param {jqObject}
		*            field
		* @param {jqObject}
		*            the prompt
		* @param {Map}
		*            options
		* @return positions
		*/
        _calculatePosition: function (field, promptElmt, options) {

            var promptTopPosition, promptleftPosition, marginTopSize;
            var fieldWidth = field.width();
            var fieldLeft = field.position().left;
            var fieldTop = field.position().top;
            var fieldHeight = field.height();
            var promptHeight = promptElmt.height();


            // is the form contained in an overflown container?
            promptTopPosition = promptleftPosition = 0;
            // compensation for the arrow
            marginTopSize = -promptHeight;


            //prompt positioning adjustment support
            //now you can adjust prompt position
            //usage: positionType:Xshift,Yshift
            //for example:
            //   bottomLeft:+20 means bottomLeft position shifted by 20 pixels right horizontally
            //   topRight:20, -15 means topRight position shifted by 20 pixels to right and 15 pixels to top
            //You can use +pixels, - pixels. If no sign is provided than + is default.
            var positionType = field.data("promptPosition") || options.promptPosition;
            var shift1 = "";
            var shift2 = "";
            var shiftX = 0;
            var shiftY = 0;
            if (typeof (positionType) == 'string') {
                //do we have any position adjustments ?
                if (positionType.indexOf(":") != -1) {
                    shift1 = positionType.substring(positionType.indexOf(":") + 1);
                    positionType = positionType.substring(0, positionType.indexOf(":"));

                    //if any advanced positioning will be needed (percents or something else) - parser should be added here
                    //for now we use simple parseInt()

                    //do we have second parameter?
                    if (shift1.indexOf(",") != -1) {
                        shift2 = shift1.substring(shift1.indexOf(",") + 1);
                        shift1 = shift1.substring(0, shift1.indexOf(","));
                        shiftY = parseInt(shift2);
                        if (isNaN(shiftY)) shiftY = 0;
                    };

                    shiftX = parseInt(shift1);
                    if (isNaN(shift1)) shift1 = 0;

                };
            };


            switch (positionType) {
                default:
                case "topRight":
                    promptleftPosition += fieldLeft + fieldWidth - 27;
                    promptTopPosition += fieldTop;
                    break;

                case "topLeft":
                    promptTopPosition += fieldTop;
                    promptleftPosition += fieldLeft;
                    break;

                case "centerRight":
                    promptTopPosition = fieldTop + 4;
                    marginTopSize = 0;
                    promptleftPosition = fieldLeft + field.outerWidth(true) + 5;
                    break;
                case "centerLeft":
                    promptleftPosition = fieldLeft - (promptElmt.width() + 2);
                    promptTopPosition = fieldTop + 4;
                    marginTopSize = 0;
                    break;
                case "bottomLeft":
                    promptTopPosition = fieldTop + field.height() + 5;
                    marginTopSize = 0;
                    promptleftPosition = fieldLeft;
                    break;
                case "bottomRight":
                    promptleftPosition = fieldLeft + fieldWidth - 27;
                    promptTopPosition = fieldTop + field.height() + 5;
                    marginTopSize = 0;
                    break;
                case "rightTop":
                    promptTopPosition = fieldTop;
                    marginTopSize = 0;
                    promptleftPosition = fieldLeft + field.outerWidth(true) + 5;
                    break;
                case "inline":
                    promptleftPosition = 0;
                    promptTopPosition = 0;
                    marginTopSize = 0;
            };



            //apply adjusments if any
            promptleftPosition += shiftX;
            promptTopPosition += shiftY;

            return {
                "callerTopPosition": promptTopPosition + "px",
                "callerleftPosition": promptleftPosition + "px",
                "marginTopSize": marginTopSize + "px"
            };
        },
        /**
		* Closes the prompt associated with the given field
		*
		* @param {jqObject}
		*            field
		*/
        _closePrompt: function (field) {           
            var prompt = this._getPrompt(field);
            if (prompt) {
                this.trigger("hide", field);
                prompt.fadeTo("fast", 0, function () {
                    prompt.closest('.formError').remove();
                });
            }
        },       
        /**
		* Returns the error prompt matching the field if any
		*
		* @param {jqObject}
		*            field
		* @return undefined or the error prompt (jqObject)
		*/
        _getPrompt: function (field) {
            var formId = $(field).closest('form, .validationEngineContainer').attr('id');
            var className = this._getClassName(field.attr("id")) + "formError";
            var match = $("." + this._escapeExpression(className) + '.parentForm' + this._getClassName(formId))[0];
            if (match)
                return $(match);
        },
        /**
        * Removes forbidden characters from class name
        * @param {String} className
        */
        _getClassName: function (className) {
            if (className)
                return className.replace(/:/g, "_").replace(/\./g, "_");
        },
        /**
		  * Returns the escapade classname
		  *
		  * @param {selector}
		  *            className
		  */
        _escapeExpression: function (selector) {
            return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1");
        },
        /**
		* Handling css classes of fields indicating result of validation
		*
		* @param {jqObject}
		*            field
		* @param {Array[String]}
		*            field's validation rules
		* @private
		*/
        _handleStatusCssClasses: function (field) {
            var options = this.get("options");
            /* remove all classes */
            if (options.addSuccessCssClassToField)
                field.removeClass(options.addSuccessCssClassToField);

            if (options.addFailureCssClassToField)
                field.removeClass(options.addFailureCssClassToField);

            /* Add classes */
            if (options.addSuccessCssClassToField && !options.isError)
                field.addClass(options.addSuccessCssClassToField);

            if (options.addFailureCssClassToField && options.isError)
                field.addClass(options.addFailureCssClassToField);
        },
        /********************
         * _getErrorMessage
         *
         * @param form
         * @param field
         * @param rule
         * @param rules
         * @param i
         * @param options
         * @param originalValidationMethod
         * @return {*}
         * @private
         */
        _getErrorMessage: function (form, field, rule, rules, i, options, originalValidationMethod) {
            // If we are using the custon validation type, build the index for the rule.
            // Otherwise if we are doing a function call, make the call and return the object
            // that is passed back.
            var rule_index = jQuery.inArray(rule, rules);
            if (rule === "custom" || rule === "funcCall" || rule === "funcCallRequired") {
                var custom_validation_type = rules[rule_index + 1];
                rule = rule + "[" + custom_validation_type + "]";
                // Delete the rule from the rules array so that it doesn't try to call the
                // same rule over again
                delete (rules[rule_index]);
            }
            // Change the rule to the composite rule, if it was different from the original
            var alteredRule = rule;


            var element_classes = (field.attr("data-validation-engine")) ? field.attr("data-validation-engine") : field.attr("class");
            var element_classes_array = element_classes.split(" ");

            // Call the original validation method. If we are dealing with dates or checkboxes, also pass the form
            var errorMsg;
            if (rule == "future" || rule == "past" || rule == "maxCheckbox" || rule == "minCheckbox") {
                errorMsg = originalValidationMethod(form, field, rules, i, options);
            } else {
                errorMsg = originalValidationMethod(field, rules, i, options);
            }

            // If the original validation method returned an error and we have a custom error message,
            // return the custom message instead. Otherwise return the original error message.
            if (errorMsg != undefined) {
                var custom_message = this._getCustomErrorMessage($(field), element_classes_array, alteredRule, options);
                if (custom_message) errorMsg = custom_message;
            }
            return errorMsg;

        },
        _getCustomErrorMessage: function (field, classes, rule, options) {
            var custom_message = false;
            var validityProp = /^custom\[.*\]$/.test(rule) ? this._validityProp["custom"] : this._validityProp[rule];
            // If there is a validityProp for this rule, check to see if the field has an attribute for it
            if (validityProp != undefined) {
                custom_message = field.attr("data-errormessage-" + validityProp);
                // If there was an error message for it, return the message
                if (custom_message != undefined)
                    return custom_message;
            }
            custom_message = field.attr("data-errormessage");
            // If there is an inline custom error message, return it
            if (custom_message != undefined)
                return custom_message;
            var id = '#' + field.attr("id");
            // If we have custom messages for the element's id, get the message for the rule from the id.
            // Otherwise, if we have custom messages for the element's classes, use the first class message we find instead.
            if (typeof options.custom_error_messages[id] != "undefined" &&
				typeof options.custom_error_messages[id][rule] != "undefined") {
                custom_message = options.custom_error_messages[id][rule]['message'];
            } else if (classes.length > 0) {
                for (var i = 0; i < classes.length && classes.length > 0; i++) {
                    var element_class = "." + classes[i];
                    if (typeof options.custom_error_messages[element_class] != "undefined" &&
						typeof options.custom_error_messages[element_class][rule] != "undefined") {
                        custom_message = options.custom_error_messages[element_class][rule]['message'];
                        break;
                    }
                }
            }
            if (!custom_message &&
				typeof options.custom_error_messages[rule] != "undefined" &&
				typeof options.custom_error_messages[rule]['message'] != "undefined") {
                custom_message = options.custom_error_messages[rule]['message'];
            }
            return custom_message;
        },
        _validityProp: {
            "required": "value-missing",
            "custom": "custom-error",
            "groupRequired": "value-missing",
            "ajax": "custom-error",
            "minSize": "range-underflow",
            "maxSize": "range-overflow",
            "min": "range-underflow",
            "max": "range-overflow",
            "past": "type-mismatch",
            "future": "type-mismatch",
            "dateRange": "type-mismatch",
            "dateTimeRange": "type-mismatch",
            "maxCheckbox": "range-overflow",
            "minCheckbox": "range-underflow",
            "equals": "pattern-mismatch",
            "funcCall": "custom-error",
            "funcCallRequired": "custom-error",
            "creditCard": "pattern-mismatch",
            "condRequired": "value-missing"
        },
        /**
		* Required validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @param {bool} condRequired flag when method is used for internal purpose in condRequired check
		* @return an error string if validation failed
		*/
        _required: function (field, rules, i, options, condRequired) {
            switch (field.prop("type")) {
                case "radio":
                case "checkbox":
                    // new validation style to only check dependent field
                    if (condRequired) {
                        if (!field.prop('checked')) {
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                        }
                        break;
                    }
                    // old validation style
                    var form = field.closest("form, .validationEngineContainer");
                    var name = field.attr("name");
                    if (form.find("input[name='" + name + "']:checked").size() == 0) {
                        if (form.find("input[name='" + name + "']:visible").size() == 1)
                            return options.allrules[rules[i]].alertTextCheckboxe;
                        else
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                    }
                    break;
                case "text":
                case "password":
                case "textarea":
                case "file":
                case "select-one":
                case "select-multiple":
                default:
                    var field_val = $.trim(field.val());
                    var dv_placeholder = $.trim(field.attr("data-validation-placeholder"));
                    var placeholder = $.trim(field.attr("placeholder"));
                    if (
						   (!field_val)
						|| (dv_placeholder && field_val == dv_placeholder)
						|| (placeholder && field_val == placeholder)
					) {
                        return options.allrules[rules[i]].alertText;
                    }
                    break;
            }
        },
        /**
		* Validate that 1 from the group field is required
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _groupRequired: function (field, rules, i, options) {
            var self = this;
            var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
            var isValid = false;
            // Check all fields from the group
            field.closest("form, .validationEngineContainer").find(classGroup).each(function () {
                if (!self._required($(this), rules, i, options)) {
                    isValid = true;
                    return false;
                }
            });

            if (!isValid) {
                return options.allrules[rules[i]].alertText;
            }
        },
        /**
		* Validate rules
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _custom: function (field, rules, i, options) {
            var customRule = rules[i + 1];
            var rule = options.allrules[customRule];
            var fn;
            if (!rule) {
                console.log("jqv:custom rule not found - " + customRule);
                return;
            }

            if (rule["regex"]) {
                var ex = rule.regex;
                if (!ex) {
                    console.log("jqv:custom regex not found - " + customRule);
                    return;
                }
                var pattern = new RegExp(ex);

                if (!pattern.test(field.val())) return options.allrules[customRule].alertText;

            } else if (rule["func"]) {
                fn = rule["func"];

                if (typeof (fn) !== "function") {
                    console.log("jqv:custom parameter 'function' is no function - " + customRule);
                    return;
                }

                if (!fn(field, rules, i, options))
                    return options.allrules[customRule].alertText;
            } else {
                console.log("jqv:custom type not allowed " + customRule);
                return;
            }
        },
        /**
		* Validate custom function outside of the engine scope
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _funcCall: function (field, rules, i, options) {
            var functionName = rules[i + 1];
            var fn;
            if (functionName.indexOf('.') > -1) {
                var namespaces = functionName.split('.');
                var scope = window;
                while (namespaces.length) {
                    scope = scope[namespaces.shift()];
                }
                fn = scope;
            }
            else
                fn = window[functionName] || options.customFunctions[functionName];
            if (typeof (fn) == 'function')
                return fn(field, rules, i, options);

        },
        _funcCallRequired: function (field, rules, i, options) {
            return this._funcCall(field, rules, i, options);
        },
        /**
		* Field match
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _equals: function (field, rules, i, options) {
            var equalsField = rules[i + 1];

            if (field.val() != $("#" + equalsField).val())
                return options.allrules.equals.alertText;
        },
        /**
		* Check the maximum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _maxSize: function (field, rules, i, options) {
            var max = rules[i + 1];
            var len = field.val().length;

            if (len > max) {
                var rule = options.allrules.maxSize;
                return rule.alertText + max + rule.alertText2;
            }
        },
        /**
		* Check the minimum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _minSize: function (field, rules, i, options) {
            var min = rules[i + 1];
            var len = field.val().length;

            if (len < min) {
                var rule = options.allrules.minSize;
                return rule.alertText + min + rule.alertText2;
            }
        },
        /**
		* Check number minimum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _min: function (field, rules, i, options) {
            var min = parseFloat(rules[i + 1]);
            var len = parseFloat(field.val());

            if (len < min) {
                var rule = options.allrules.min;
                if (rule.alertText2) return rule.alertText + min + rule.alertText2;
                return rule.alertText + min;
            }
        },
        /**
		* Check number maximum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _max: function (field, rules, i, options) {
            var max = parseFloat(rules[i + 1]);
            var len = parseFloat(field.val());

            if (len > max) {
                var rule = options.allrules.max;
                if (rule.alertText2) return rule.alertText + max + rule.alertText2;
                //orefalo: to review, also do the translations
                return rule.alertText + max;
            }
        },
        /**
		* Checks date is in the past
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _past: function (form, field, rules, i, options) {

            var p = rules[i + 1];
            var fieldAlt = $(form.find("*[name='" + p.replace(/^#+/, '') + "']"));
            var pdate;

            if (p.toLowerCase() == "now") {
                pdate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(":disabled"))
                    return;
                pdate = this._parseDate(fieldAlt.val());
            } else {
                pdate = this._parseDate(p);
            }
            var vdate = this._parseDate(field.val());

            if (vdate > pdate) {
                var rule = options.allrules.past;
                if (rule.alertText2) return rule.alertText + this._dateToString(pdate) + rule.alertText2;
                return rule.alertText + this._dateToString(pdate);
            }
        },
        /**
		* Checks date is in the future
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _future: function (form, field, rules, i, options) {

            var p = rules[i + 1];
            var fieldAlt = $(form.find("*[name='" + p.replace(/^#+/, '') + "']"));
            var pdate;

            if (p.toLowerCase() == "now") {
                pdate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(":disabled"))
                    return;
                pdate = this._parseDate(fieldAlt.val());
            } else {
                pdate = this._parseDate(p);
            }
            var vdate = this._parseDate(field.val());

            if (vdate < pdate) {
                var rule = options.allrules.future;
                if (rule.alertText2)
                    return rule.alertText + this._dateToString(pdate) + rule.alertText2;
                return rule.alertText + this._dateToString(pdate);
            }
        },
        /**
		* Checks if valid date
		*
		* @param {string} date string
		* @return a bool based on determination of valid date
		*/
        _isDate: function (value) {
            var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
            return dateRegEx.test(value);
        },
        /**
		* Checks if valid date time
		*
		* @param {string} date string
		* @return a bool based on determination of valid date time
		*/
        _isDateTime: function (value) {
            var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
            return dateTimeRegEx.test(value);
        },
        //Checks if the start date is before the end date
        //returns true if end is later than start
        _dateCompare: function (start, end) {
            return (new Date(start.toString()) < new Date(end.toString()));
        },
        /**
		* Checks date range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
        _dateRange: function (field, rules, i, options) {
            //are not both populated
            if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are not both dates
            if (!this._isDate(options.firstOfGroup[0].value) || !this._isDate(options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }

            //are both dates but range is off
            if (!this._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },
        /**
		* Checks date time range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
        _dateTimeRange: function (field, rules, i, options) {
            //are not both populated
            if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            //are not both dates
            if (!this._isDateTime(options.firstOfGroup[0].value) || !this._isDateTime(options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            //are both dates but range is off
            if (!this._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },
        /**
		* Max number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _maxCheckbox: function (form, field, rules, i, options) {

            var nbCheck = rules[i + 1];
            var groupname = field.attr("name");
            var groupSize = form.find("input[name='" + groupname + "']:checked").size();
            if (groupSize > nbCheck) {
                options.showArrow = false;
                if (options.allrules.maxCheckbox.alertText2)
                    return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
                return options.allrules.maxCheckbox.alertText;
            }
        },
        /**
		* Min number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _minCheckbox: function (form, field, rules, i, options) {

            var nbCheck = rules[i + 1];
            var groupname = field.attr("name");
            var groupSize = form.find("input[name='" + groupname + "']:checked").size();
            if (groupSize < nbCheck) {
                options.showArrow = false;
                return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2;
            }
        },
        /**
		* Checks that it is a valid credit card number according to the
		* Luhn checksum algorithm.
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
        _creditCard: function (field, rules, i, options) {
            //spaces and dashes may be valid characters, but must be stripped to calculate the checksum.
            var valid = false, cardNumber = field.val().replace(/ +/g, '').replace(/-+/g, '');

            var numDigits = cardNumber.length;
            if (numDigits >= 14 && numDigits <= 16 && parseInt(cardNumber) > 0) {

                var sum = 0, i = numDigits - 1, pos = 1, digit, luhn = new String();
                do {
                    digit = parseInt(cardNumber.charAt(i));
                    luhn += (pos++ % 2 == 0) ? digit * 2 : digit;
                } while (--i >= 0)

                for (i = 0; i < luhn.length; i++) {
                    sum += parseInt(luhn.charAt(i));
                }
                valid = sum % 10 == 0;
            }
            if (!valid) return options.allrules.creditCard.alertText;
        },
        /**
		* Ajax field validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return nothing! the ajax validator handles the prompts itself
		*/
        _ajax: function (field, rules, i, options) {
            var self = this;
            var errorSelector = rules[i + 1];
            var rule = options.allrules[errorSelector];
            var extraData = rule.extraData;
            var extraDataDynamic = rule.extraDataDynamic;
            var data = {
                "fieldId": field.attr("id"),
                "fieldValue": field.val()
            };

            if (typeof extraData === "object") {
                $.extend(data, extraData);
            } else if (typeof extraData === "string") {
                var tempData = extraData.split("&");
                for (var i = 0; i < tempData.length; i++) {
                    var values = tempData[i].split("=");
                    if (values[0] && values[0]) {
                        data[values[0]] = values[1];
                    }
                }
            }

            if (extraDataDynamic) {
                var tmpData = [];
                var domIds = String(extraDataDynamic).split(",");
                for (var i = 0; i < domIds.length; i++) {
                    var id = domIds[i];
                    if ($(id).length) {
                        var inputValue = field.closest("form, .validationEngineContainer").find(id).val();
                        var keyValue = id.replace('#', '') + '=' + escape(inputValue);
                        data[id.replace('#', '')] = inputValue;
                    }
                }
            }

            // If a field change event triggered this we want to clear the cache for this ID
            if (options.eventTrigger == "field") {
                delete (options.ajaxValidCache[field.attr("id")]);
            }

            // If there is an error or if the the field is already validated, do not re-execute AJAX
            if (!options.isError && !self._checkAjaxFieldStatus(field.attr("id"), options)) {
                $.ajax({
                    type: options.ajaxFormValidationMethod,
                    url: rule.url,
                    cache: false,
                    dataType: "json",
                    data: data,
                    field: field,
                    rule: rule,
                    methods: self,
                    options: options,
                    beforeSend: function () { },
                    error: function (data, transport) {
                        if (options.onFailure) {
                            options.onFailure(data, transport);
                        } else {
                            self._ajaxError(data, transport);
                        }
                    },
                    success: function (json) {

                        // asynchronously called on success, data is the json answer from the server
                        var errorFieldId = json[0];
                        //var errorField = $($("#" + errorFieldId)[0]);
                        var errorField = $("#" + errorFieldId).eq(0);

                        // make sure we found the element
                        if (errorField.length == 1) {
                            var status = json[1];
                            // read the optional msg from the server
                            var msg = json[2];
                            if (!status) {
                                // Houston we got a problem - display an red prompt
                                options.ajaxValidCache[errorFieldId] = false;
                                options.isError = true;

                                // resolve the msg prompt
                                if (msg) {
                                    if (options.allrules[msg]) {
                                        var txt = options.allrules[msg].alertText;
                                        if (txt) {
                                            msg = txt;
                                        }
                                    }
                                }
                                else
                                    msg = rule.alertText;

                                if (options.showPrompts) self._showPrompt(errorField, msg, "", true, options);
                            } else {
                                options.ajaxValidCache[errorFieldId] = true;

                                // resolves the msg prompt
                                if (msg) {
                                    if (options.allrules[msg]) {
                                        var txt = options.allrules[msg].alertTextOk;
                                        if (txt) {
                                            msg = txt;
                                        }
                                    }
                                }
                                else
                                    msg = rule.alertTextOk;

                                if (options.showPrompts) {
                                    // see if we should display a green prompt
                                    if (msg)
                                        self._showPrompt(errorField, msg, "pass", true, options);
                                    else
                                        self._closePrompt(errorField);
                                }

                                // If a submit form triggered this, we want to re-submit the form
                                if (options.eventTrigger == "submit")
                                    field.closest("form").submit();
                            }
                        }
                        errorField.trigger("jqv.field.result", [errorField, options.isError, msg]);
                    }
                });

                return rule.alertTextLoad;
            }
        },
        /**
		* Common method to handle ajax errors
		*
		* @param {Object} data
		* @param {Object} transport
		*/
        _ajaxError: function (data, transport) {
            if (data.status == 0 && transport == null)
                alert("The page is not served from a server! ajax call failed");
            else if (typeof console != "undefined")
                console.log("Ajax error: " + data.status + " " + transport);
        },
        /**
		* date -> string
		*
		* @param {Object} date
		*/
        _dateToString: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        /**
		* Parses an ISO date
		* @param {String} d
		*/
        _parseDate: function (d) {

            var dateParts = d.split("-");
            if (dateParts == d)
                dateParts = d.split("/");
            if (dateParts == d) {
                dateParts = d.split(".");
                return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
            }
            return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
        },
        /**
    * Typically called when user exists a field using tab or a mouse click, triggers a field
    * validation
    */
        _onFieldEvent: function (event, obj) {
            var self = this;
            var field = $(obj);
            var form = field.closest('form, .validationEngineContainer');
            var options = self.options;
            options.eventTrigger = "field";
            if (options.notEmpty == true) {
                if (field.val().length > 0) {
                    // validate the current field
                    window.setTimeout(function () {
                        self._validateField(field, options);
                    }, (event.data) ? event.data.delay : 0);

                }

            } else {
                // validate the current field
                window.setTimeout(function () {
                    self._validateField(field, options);
                }, (event.data) ? event.data.delay : 0);

            }

            //_closePrompt

        }
    });
    return validate;
});
