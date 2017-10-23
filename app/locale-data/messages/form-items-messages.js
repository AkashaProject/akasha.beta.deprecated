import { defineMessages } from 'react-intl';

const formMessages = defineMessages({
    addressRequired: {
        id: 'app.form.addressRequired',
        description: 'receiver input required error message',
        defaultMessage: 'You must specify an username or an ethereum address'
    },
    acceptTips: {
        id: 'app.form.acceptTips',
        description: 'description for accept tips switch',
        defaultMessage: 'Accept Tips'
    },
    insufficientEth: {
        id: 'app.form.insufficientEth',
        description: 'title for insufficient funds card',
        defaultMessage: 'Sorry, you don\'t have enough ether!'
    },
    depositEth: {
        id: 'app.form.depositEth',
        description: 'description for insufficient funds card',
        defaultMessage: 'You need to deposit ether to publish your profile.'
    },
    aethAmountLabel: {
        id: 'app.form.aethAmount',
        description: 'aeth amount input label',
        defaultMessage: 'AETH amount'
    },
    amountRequired: {
        id: 'app.form.amountRequired',
        description: 'amount input required error message',
        defaultMessage: 'Amount is required'
    },
    maxAethAmount: {
        id: 'app.form.maxAethAmount',
        description: 'max AETH amount transferable',
        defaultMessage: '{aeth} Transferable AETH'
    },
    maxAethAmountLabel: {
        id: 'app.form.maxAethAmountLabel',
        description: 'max aeth amount label',
        defaultMessage: 'max. {balance}'
    },
    maxEssenceAmount: {
        id: 'app.form.maxEssenceAmount',
        description: 'max essence amount transformable',
        defaultMessage: '{essence} Essence available'
    },
    maxEthAmount: {
        id: 'app.form.maxEthAmount',
        description: 'max ETH amount transferable',
        defaultMessage: '{eth} ETH transferable'
    },
    maxManafiedAethAmount: {
        id: 'app.form.maxManafiedAethAmount',
        description: 'max AETH amount that can be cycled',
        defaultMessage: '{manafied} Manafied AETH'
    },
    messageOptional: {
        id: 'app.form.messageOptional',
        description: 'tip message input label',
        defaultMessage: 'Message (Optional)'
    },
    transformEssence: {
        id: 'app.form.transformEssence',
        description: 'title for transform essence form',
        defaultMessage: 'Transform Essence'
    },
    transformEssenceDisclaimer: {
        id: 'app.form.transformEssenceDisclaimer',
        description: 'disclaimer message for transforming essence to AETH',
        defaultMessage: '{amount} Essence will forge {value} new AETH in your balance.'
    },
    transformEssenceMin: {
        id: 'app.form.transformEssenceMin',
        description: 'disclaimer message for minimum amount of essence that can be transformed',
        defaultMessage: 'You need to transform minimum 1000 Essence'
    },
    transformManafiedDisclaimer: {
        id: 'app.form.transformManafiedDisclaimer',
        description: 'disclaimer message for transforming manafied/bonded AETH to cycling AETH',
        defaultMessage: '{amount} AETH will cycle back into transferable AETH in 7 days. {amount} Mana will no longer regenerate.'
    },
    transformTransferableDisclaimer: {
        id: 'app.form.transformTransferableDisclaimer',
        description: 'disclaimer message for transforming manafied/bonded AETH to cycling AETH',
        defaultMessage: '{amount} AETH will generate {amount} Mana every 24 hours for as long as it is kept in this state.'
    },
    firstName: {
        id: 'app.firstName',
        description: 'Placeholder for first name input',
        defaultMessage: 'First Name'
    },
    lastName: {
        id: 'app.lastName',
        description: 'Placeholder for last name input',
        defaultMessage: 'Last Name'
    },
    akashaId: {
        id: 'app.akashaId',
        description: 'Placeholder for last name input',
        defaultMessage: 'Akasha ID'
    },
    ethereumAddress: {
        id: 'app.form.ethereumAddress',
        description: 'Placeholder for ethereum address input',
        defaultMessage: 'Ethereum address'
    },
    from: {
        id: 'app.form.from',
        description: 'from',
        defaultMessage: 'From'
    },
    passphrase: {
        id: 'app.form.passphrase',
        description: 'label for passphrase input',
        defaultMessage: 'Passphrase'
    },
    passphrasePlaceholder: {
        id: 'app.form.passphrasePlaceholder',
        description: 'placeholder for passphrase input',
        defaultMessage: 'Type your passphrase'
    },
    amountToShift: {
        id: 'app.form.amountToShift',
        description: 'label for shift amount slider',
        defaultMessage: 'Please select an amount to shift'
    },
    confirmPassphrase: {
        id: 'app.form.confirmPassphrase',
        description: 'label for passphrase fghfgconfirmation input',
        defaultMessage: 'Confirm passphrase'
    },
    confirmPassphraseToContinue: {
        id: 'app.form.confirmPassphraseToContinue',
        description: 'Label for confirming passphrase',
        defaultMessage: 'You need to confirm your passphrase to continue'
    },
    forgeAeth: {
        id: 'app.form.forgeAeth',
        description: 'transform Essence into new AETH',
        defaultMessage: 'Forge AETH'
    },
    freeAeth: {
        id: 'app.form.freeAeth',
        description: 'label for free AETH value',
        defaultMessage: 'Free AETH'
    },
    gasAmountError: {
        id: 'app.form.gasAmountError',
        description: 'Error displayed when gas amount is not between limits',
        defaultMessage: 'Gas amount must be between {min} and {max}'
    },
    manaTotalScore: {
        id: 'app.form.manaTotalScore',
        description: 'label for mana total score',
        defaultMessage: 'Mana total score'
    },
    name: {
        id: 'app.inputField.name',
        description: 'Placeholder for name input field',
        defaultMessage: 'Name'
    },
    passphraseConfirmError: {
        id: 'app.form.passphraseConfirmError',
        description: 'Error message displayed when the given passphrases don\'t match',
        defaultMessage: 'Passphrases don\'t match. Please type the passphrase again'
    },
    passphraseVerify: {
        id: 'app.passphraseVerify',
        description: 'Placeholder for passphrase verify input',
        defaultMessage: 'Verify passphrase'
    },
    requiredError: {
        id: 'app.form.requiredError',
        description: 'error message for required fields',
        defaultMessage: 'This field is required'
    },
    shiftDown: {
        id: 'app.form.shiftDown',
        description: 'shift down',
        defaultMessage: 'Shift down'
    },
    shiftDownMana: {
        id: 'app.form.shiftDownMana',
        description: 'title for shift down mana form',
        defaultMessage: 'Shift down Mana'
    },
    shiftDownManaHelp: {
        id: 'app.form.shiftDownManaHelp',
        description: 'label for shift down mana slider',
        defaultMessage: '{value} Mana will transform {value} Manafied AETH to Cycling AETH that can be collected in 7 days.'
    },
    shiftUp: {
        id: 'app.form.shiftUp',
        description: 'shift up',
        defaultMessage: 'Shift up'
    },
    shiftUpMana: {
        id: 'app.form.shiftUpMana',
        description: 'title for shift up mana form',
        defaultMessage: 'Shift up Mana'
    },
    shiftUpManaHelp: {
        id: 'app.form.shiftUpManaHelp',
        description: 'label for shift up mana slider',
        defaultMessage: '{value} Mana will manafy {value} Transferable AETH'
    },
    tips: {
        id: 'app.form.tips',
        description: 'label for tips',
        defaultMessage: 'TIPS'
    },
    title: {
        id: 'app.inputField.title',
        description: 'Placeholder for title input field',
        defaultMessage: 'Title'
    },
    totalAethBalance: {
        id: 'app.form.totalAethBalance',
        description: 'label for total AETH balance',
        defaultMessage: 'Total AETH balance'
    },
    url: {
        id: 'app.inputField.url',
        description: 'Placeholder for url input field',
        defaultMessage: 'URL'
    },
    voteWeightIntegerError: {
        id: 'app.form.voteWeightIntegerError',
        description: 'Error displayed when vote weight is not an integer',
        defaultMessage: 'Vote weight must be an integer'
    },
    voteWeightRangeError: {
        id: 'app.form.voteWeightRangeError',
        description: 'Error displayed when vote weight is not between limits',
        defaultMessage: 'Vote weight must be between {min} and {max}'
    },
    voteWeightRequired: {
        id: 'app.form.voteWeightRequired',
        description: 'Error displayed when vote weight is not specified',
        defaultMessage: 'Vote weight is required'
    },
    voteWeightExtra: {
        id: 'app.form.voteWeightExtra',
        description: 'extra information about the vote weight input',
        defaultMessage: 'Define a value between {min} and {max}'
    },
    notEnoughFunds: {
        id: 'app.form.notEnoughFunds',
        description: 'Error displayed when a user does not have enough funds for an action',
        defaultMessage: 'You don\'t have enough funds in your balance'
    },
    alphanumericError: {
        id: 'app.form.alphanumericError',
        description: 'Error displayed when a tag contains invalid characters',
        defaultMessage: 'Tags can contain only letters, numbers, and one dash ( - ) or underscore ( _ ) between characters.'
    },
    selectOneOption: {
        id: 'app.form.selectOneOption',
        description: 'Label for simple select field',
        defaultMessage: 'Select one option'
    },
    tooShortError: {
        id: 'app.form.tooShortError',
        description: 'Error displayed when a tag contains less than 4 characters',
        defaultMessage: 'Tags should have at least 4 characters.'
    },
    tooLongError: {
        id: 'app.form.tooLongError',
        description: 'Error displayed when a tag contains more than 24 characters',
        defaultMessage: 'Tags can have maximum 24 characters.'
    },
    tagAlreadyAdded: {
        id: 'app.form.tagAlreadyAdded',
        description: 'Error displayed when trying to add a tag that already exists',
        defaultMessage: 'Tag {tag} already added'
    },
    rememberPassFor: {
        id: 'app.form.rememberPassFor',
        description: 'Label for checkbox to remember password',
        defaultMessage: 'Remember my passphrase for'
    },
    tipAmountError: {
        id: 'app.form.tipAmountError',
        description: 'Error displayed when the tip amount is smaller than the minimum allowed value',
        defaultMessage: 'The amount should be at least {minAmount} AETH'
    },
    to: {
        id: 'app.form.to',
        description: 'to',
        defaultMessage: 'To'
    },
    updateSettings: {
        id: 'app.form.updateSettings',
        description: 'label for update settings button',
        defaultMessage: 'Update settings'
    }
});
export { formMessages };
