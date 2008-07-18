/**
 * Copyright (C) 2005-2008 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * User Profile component.
 * 
 * @namespace Alfresco
 * @class Alfresco.UserProfile
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Element = YAHOO.util.Element;
   
   /**
    * UserProfile constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.UserProfile} The new UserProfile instance
    * @constructor
    */
   Alfresco.UserProfile = function(htmlId)
   {
      this.name = "Alfresco.UserProfile";
      this.id = htmlId;
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["button", "container"], this.onComponentsLoaded, this);
      
      return this;
   }
   
   Alfresco.UserProfile.prototype =
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Current userId.
          * 
          * @property userId
          * @type string
          */
         userId: ""
      },

      /**
       * FileUpload module instance.
       * 
       * @property fileUpload
       * @type Alfresco.module.FileUpload
       */
      fileUpload: null,

      /**
       * Object container for storing YUI widget instances.
       * 
       * @property widgets
       * @type object
       */
      widgets: {},

      /**
       * Object container for storing module instances.
       * 
       * @property modules
       * @type object
       */
      modules: {},

      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       * @return {Alfresco.UserProfile} returns 'this' for method chaining
       */
      setOptions: function UP_setOptions(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);
         return this;
      },
      
      /**
       * Set messages for this component.
       *
       * @method setMessages
       * @param obj {object} Object literal specifying a set of messages
       * @return {Alfresco.UserProfile} returns 'this' for method chaining
       */
      setMessages: function UP_setMessages(obj)
      {
         Alfresco.util.addMessages(obj, this.name);
         return this;
      },
      
      /**
       * Fired by YUILoaderHelper when required component script files have
       * been loaded into the browser.
       *
       * @method onComponentsLoaded
       */
      onComponentsLoaded: function UP_onComponentsLoaded()
      {
         Event.onContentReady(this.id, this.onReady, this, true);
      },
   
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function UP_onReady()
      {
         // Reference to self used by inline functions
         var me = this;
         
         // Buttons
         this.widgets.upload = Alfresco.util.createYUIButton(this, "button-upload", this.onUpload);
         this.widgets.save = Alfresco.util.createYUIButton(this, "button-save", this.onSave);
         this.widgets.cancel = Alfresco.util.createYUIButton(this, "button-cancel", this.onCancel);
         
         // Finally show the component body here to prevent UI artifacts on YUI button decoration
         Dom.setStyle(this.id + "-body", "visibility", "visible");
      },
      

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      /**
       * Upload button click handler
       *
       * @method onUpload
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onUpload: function UP_onUpload(e, p_obj)
      {
         if (this.fileUpload === null)
         {
            this.fileUpload = Alfresco.module.getFileUploadInstance();
         }
         
         // Show uploader for single file select
         // TODO: need to allow for upload dir noderef - i.e. not site related
         var uploadConfig =
         {
            siteId: "none",
            containerId: "none",
            uploadDirectory: "none",
            filter: [],
            mode: this.fileUpload.MODE_SINGLE_UPLOAD,
            onFileUploadComplete:
            {
               fn: this.onFileUploadComplete,
               scope: this
            }
         }
         this.fileUpload.show(uploadConfig);
         Event.preventDefault(e);
      },
      
      /**
       * File Upload complete event handler
       *
       * @method onFileUploadComplete
       * @param complete {object} Object literal containing details of successful and failed uploads
       */
      onFileUploadComplete: function UP_onFileUploadComplete(complete)
      {
         var success = complete.successful.length;
         if (success > 0)
         {
            
         }
      },
      
      /**
       * Save Changes button click handler
       *
       * @method onSave
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onSave: function UP_onSave(e, p_obj)
      {
         
      },
      
      /**
       * Cancel Changes button click handler
       *
       * @method onCancel
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onCancel: function UP_onCancel(e, p_obj)
      {
         
      }
   };
})();