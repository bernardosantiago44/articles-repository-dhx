/**
 * Company Form UI Module
 * Provides a unified component for configuring the company's settings.
 * 
 * Dependencies: 
 * - dataModel.js
 * 
 */

const CompanyFormUI = (function() {
    'use strict';
    
    // MARK - State and constants
    let formState = {
        companyId: null,
        settingsWindow: null,
    }

    const FORM_WINDOW_WIDTH = 900;
    const FORM_WINDOW_HEIGHT = 850;
    
    // MARK - Functions
    function resetFormState() {
        formState.companyId = null;
        formState.settingsWindow = null;
    }
    
    function createCompanyFormWindow() {
        const dhxWindows = new dhtmlXWindows();
        
        const formWindow = dhxWindows.createWindow('company_settings_window', 0, 0,FORM_WINDOW_WIDTH, FORM_WINDOW_HEIGHT);
        formWindow.setText('Configuración de la Compañía');
        formWindow.centerOnScreen();
        formWindow.setModal(true);
        formWindow.button('park').hide();
        formWindow.button('minmax').hide();
        
        return formWindow;
    }
    
    function openSettingsForm(companyId, onSaveCallback) {
        resetFormState();
        
        formState.companyId = companyId;
        formState.settingsWindow = createCompanyFormWindow()
    }
    
    return {
        openSettingsForm: openSettingsForm,
    }
})();