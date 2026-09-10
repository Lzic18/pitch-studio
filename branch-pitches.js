// branch-pitches.js
//
// Branching pitch definitions. Each entry is rendered by branch-engine.js.
// To add a new branching pitch, copy the shape below — give every node a
// unique id, write its message in `text`, list any £-style inputs it needs
// in `fields`, and wire up `branches` to point at the next node id(s).
// A node with no `branches` is an end of that conversation path.

const branchPitches = [
    {
        name: 'Insurance Pitch (Updated)',
        description: 'Pitch for device insurance. SIMO New insurance pricing: https://eshop.insurance.vodafone.com/uk',
        type: 'branching',
        insertAfter: 'Device Pitch',
        start: 'opener',
        nodes: {
            opener: {
                label: 'Handset or SIMO',
                text: `Handset(Upgrade/New) or SIMO(New)`,
                branches: {
                    yes: { label: 'Handset', next: 'handsetinsurance' },
                    no: { label: 'Simo', next: 'simoinsurance' }
                }
            },
                        handsetinsurance: {
                            label: 'Handset Pitching',
                            text: `Whilst I get the next set of terms loaded up, may I ask if you have your devices insured under your bank or home at all?`,
                            branches: {
                                yes: { label: 'Yes', next: 'handsetinsuranceyes' },
                                no: { label: 'No', next: 'handsetinsuranceno' }
                            }
                        },
                                    handsetinsuranceyes: {
                                        label: 'Has insurance',
                                        text: `And does this happen to include benefits like Next Day Replacement, Worldwide Cover, and Loss & Theft cover?`,
                                        branches: {
                                            yes: { label: 'Yes', next: 'handsetvodainsurance' },
                                            no: { label: 'No', next: 'handsetinsuranceno' }
                                        }
                                    },
                                                handsetvodainsurance: {
                            label: 'We offer',
                            text: `No worries at all. We do also offer our own insurance services, with several to choose from to cover numerous circumstances. We offer:

Loss, Theft and Damage Cover – total peace of mind
Price Per Month £[lossCover]

Damage Cover – accidents happen, we've got you
Price Per Month £[damageCover]

Screen Damage – cracks fixed fast
Price £[screenCover]

Plus enjoy:
✔ Next-day replacement
✔ Cancel anytime

Should we get one of these added for you so you're covered from the moment your phone arrives?`,
                                                    fields: [
                                                        { id: 'lossCover', label: 'Loss, Theft & Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                                                        { id: 'damageCover', label: 'Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                                                        { id: 'screenCover', label: 'Screen Damage - Price (£)', prefix: '', placeholder: '' }
                                                    ]
                                                    
                                                },
                                    handsetinsuranceno: {
                                        label: 'Doesn`t have insurance',
                                        text: `Not a problem. With Vodafone we offer Loss, Theft and Damage cover applicable worldwide, as well as any accessories with us or GetGoFone that you may have. Loss, Damage & Theft for your device would be £[fullCover] per month, granting you total cover and peace of mind. Would you like to get this added on from the moment you get your device?`,
                                        fields: [
                                            { id: 'fullCover', label: 'Loss, Damage & Theft - Price Per Month (£)', prefix: '', placeholder: '' }
                                        ],
                                        branches: {
                                            no: { label: 'No - decline', next: 'offerTwoTierInsurance' }
                                        }
                                    },
                                    offerTwoTierInsurance: {
                label: 'Damage and Screen',
                text: `That's perfectly fine. We do also offer 2 more levels of insurance to keep your device covered. We can offer:

Damage Cover – accidents happen, we've got you
Price Per Month £[damageCover2]

Screen Damage – cracks fixed fast
Price £[screenCover2]

Plus enjoy:
✔ Next-day replacement
✔ Cancel anytime

Should we get one of these added for you so you're covered from the moment your phone arrives?`,
                fields: [
                    { id: 'damageCover2', label: 'Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                    { id: 'screenCover2', label: 'Screen Damage - Price (£)', prefix: '', placeholder: '' }
                ],
                                    },
                        simoinsurance: {
                            label: 'Simo Pitching',
                            text: `May I ask what device it is you use currently?`,
                            branches: {
                                yes: { label: 'Next', next: 'simoinsurance2' }
                            }
                        },
                                    simoinsurance2: {
                                        label: 'Simo Insured Bank',
                                        text: `Thank you for confirming. And do you happen to have this device insured under your home or bank at all?`,
                                        branches: {
                                            yes: { label: 'Yes', next: 'simoinsurance3' },
                                            no: { label: 'No', next: 'simocoverno' }
                                        }
                                    },
                                                simoinsurance3: {
                                                    label: 'Existing Cover Check',
                                                    text: `And does this happen to include benefits like Next Day Replacement, Worldwide Cover, with Loss, Damage & Theft cover?`,
                                                    branches: {
                                                        yes: { label: 'Yes', next: 'simocoveryes' },
                                                        no: { label: 'No', next: 'simocoverno' }
                                                    }
                                                },

                                                simocoveryes: {
                label: 'Damage and Screen',
                text: `With Vodafone you have the benefit of registering your device with us and getting it all insured, even if not purchased with us initially. With your [insureddevice] we can offer:”
Loss, Theft and Damage Cover – total peace of mind
Price Per Month £[lossCover2]

Damage Cover – accidents happen, we've got you
Price Per Month £[damageCover2]

Screen Damage – cracks fixed fast
Price £[screenCover2]

Plus enjoy:
✔ Next-day replacement
✔ Cancel anytime

Should we get one of these added for you?`,
                fields: [
                    { id: 'insureddevice', label: 'Insured Device', prefix: '', placeholder: '' },
                    { id: 'lossCover2', label: 'Loss, Theft and Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                    { id: 'damageCover2', label: 'Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                    { id: 'screenCover2', label: 'Screen Damage - Price Per Month(£)', prefix: '', placeholder: '' }
                ],
                                    },
                                                simocoverno: {
                                                    label: 'No Existing Cover',
                                                    text: `Not a problem. With Vodafone we offer Loss, Damage & Theft cover applicable worldwide, as well as any accessories with us or GetGoFone that you may have. Loss, Damage & Theft for your device would be £[fullcover3] per month, granting you total cover and peace of mind. Would you like to get this added on from the moment you get your new SIM service starts with us?`,
                                                fields: [
                                                    { id: 'fullcover3', label: 'Loss, Theft and Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' }
                                                ],
                                                branches: {
                                                        no: { label: 'No - Decline', next: 'offerTwoTierInsurancesimo' }
                                                    }
                                                
                                                },

                                                offerTwoTierInsurancesimo: {
                label: 'Damage and Screen',
                text: `That's perfectly fine. We do also offer 2 more levels of insurance to keep your device covered. We can offer:

Damage Cover – accidents happen, we've got you
Price Per Month £[damageCover2]

Screen Damage – cracks fixed fast
Price £[screenCover2]

Plus enjoy:
✔ Next-day replacement
✔ Cancel anytime

Should we get one of these added for you so you're covered from the moment your phone arrives?`,
                fields: [
                    { id: 'damageCover2', label: 'Damage Cover - Price Per Month (£)', prefix: '', placeholder: '' },
                    { id: 'screenCover2', label: 'Screen Damage - Price (£)', prefix: '', placeholder: '' }
                ],
                                    },


        }
    }
];
