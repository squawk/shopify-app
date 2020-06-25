import React, { useCallback, useState, useEffect } from 'react';
import {
    Banner,
    Card,
    ChoiceList,
    DisplayText,
    Form,
    FormLayout,
    Frame,
    Layout,
    Page,
    PageActions,
    TextField,
    Toast,
    Heading,
    TextContainer
} from '@shopify/polaris';
import store from 'store-js';
import gql from 'graphql-tag';


import { Mutation, useQuery } from 'react-apollo';
import { Loading } from '@shopify/app-bridge/actions';
import { array } from 'prop-types';
import { nonExecutableDefinitionMessage } from 'graphql/validation/rules/ExecutableDefinitions';
// import { SELECT_ALL_ITEMS } from '@shopify/polaris/types/utilities/resource-list';




const UPDATE_METAFIELD = gql`
mutation($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        metafields(first: 100) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
    }
  }`



export default function EditProduct() {

    const [metafield, setMetafield] = useState([])
    const [item, setItem] = useState([]);
    const [selected, setSelected] = useState(['none']);
    const handleChoiceListChange = useCallback((value) => setSelected(value), []);

    useEffect(() => {
        const item = store.get('item')

        setItem(item);

        let metafields = [];
        console.log('item in use effect', item.metafields.edges.length)
        for (let i = 0; i < item.metafields.edges.length; i++) {
            let field = item.metafields.edges[i].node.key;
            metafields[field] = item.metafields.edges[i].node.value;
            metafields[field + 'ID'] = item.metafields.edges[i].node.id;
        }
        setMetafield(metafields)
        console.log('METAFIELDS', metafields)
    }, [])

    const handleChange = name => event => {
        setMetafield({ ...metafield, [name]: event });
    }

    return (
        <Mutation
            mutation={UPDATE_METAFIELD}
        >
            {(handleSubmit, { error, data }) => {
                console.log('DATA', data)
                const showError = error && (
                    <Banner status="critical">{error.message}</Banner>
                );
                const showToast = data && data.productUpdate && (
                    <Toast
                        content="Sucessfully updated"
                    // onDismiss={() => this.setState({ showToast: false })}
                    />
                );

                return (
                    <Frame>
                        <Page>
                            <Layout>

                                {showToast}
                                {/* section one */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section 1 for {item.title || ''}</DisplayText>
                                        <DisplayText size="small">The Header of your product pages is the most important section as it’s the first thing a visitor sees. You have less than 3 seconds to get their attention to read more. You have to make it count!</DisplayText>
                                        <DisplayText size="small">Every product solves a problem. You need to identify what problem the product solves. Then you need to identify what someone is feeling who has this problem. (Sad, annoyed, frustrated, jealous)</DisplayText>
                                        <DisplayText size="small">Then you need the visitor to realize you solve that problem they have.</DisplayText>
                                        <DisplayText size="small">This is done in the headline. Asking if someone has that problem with a question is one of the best ways to hit the pain point someone has who needs your product.</DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>


                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.headline || ''}
                                                        onChange={handleChange('headline')}

                                                        label="What is a question you could ask someone?"
                                                        type="text"
                                                        helpText="Examples: Have dandruff? Feeling tired or sluggish? Sick Of Zits? Got Back Pain?"

                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.outcome || ''}
                                                        onChange={handleChange('outcome')}
                                                        label="In one sentence describe the outcome of using your product."
                                                        type="price"
                                                        helpText="Examples:  “Look and feel your best in less than 24 hours!” “Grow the beard of your dreams.” “Say goodbye to pain without needing surgery.”"

                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.videolink || ''}
                                                        onChange={handleChange('videolink')}

                                                        label="Do you have a YouTube video selling the product?"
                                                        type="price"
                                                        helpText="If not, leave blank."
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>

                                        <PageActions
                                            primaryAction={[
                                                {
                                                    content: 'Next',
                                                    onAction: () => {
                                                        const productMetafield = {

                                                            "id": item.id,
                                                            "metafields": [

                                                                //section 1
                                                                {
                                                                    "id": metafield.headlineID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "headline",
                                                                    "value": metafield.headline,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.outcomeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "outcome",
                                                                    "value": metafield.outcome,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.videolinkID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "videolink",
                                                                    "value": metafield.videolink,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 2
                                                                {
                                                                    "id": metafield.logoOne || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "logoOne",
                                                                    "value": metafield.logoOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.logoTwo || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "logoTwo",
                                                                    "value": metafield.logoTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.logoThree || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "logoThree",
                                                                    "value": metafield.logoThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.logoFour || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "logoFour",
                                                                    "value": metafield.logoFour,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.logoFive || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "logoFive",
                                                                    "value": metafield.logoFive,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 3
                                                                {
                                                                    "id": metafield.featureOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "featureOne",
                                                                    "value": metafield.featureOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.benefitOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "benefitOne",
                                                                    "value": metafield.benefitOne,
                                                                    "valueType": "STRING"
                                                                },

                                                                {
                                                                    "id": metafield.featureTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "featureTwo",
                                                                    "value": metafield.featureTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.benefitTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "benefitTwo",
                                                                    "value": metafield.benefitTwo,
                                                                    "valueType": "STRING"
                                                                },

                                                                {
                                                                    "id": metafield.featureThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "featureThree",
                                                                    "value": metafield.featureThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.benefitThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "benefitThree",
                                                                    "value": metafield.benefitThree,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 4
                                                                {
                                                                    "id": metafield.stepOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "stepOne",
                                                                    "value": metafield.stepOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.stepTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "stepTwo",
                                                                    "value": metafield.stepTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.stepThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "stepThree",
                                                                    "value": metafield.stepThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.stepFourID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "stepFour",
                                                                    "value": metafield.stepFour,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.stepFiveID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "stepFive",
                                                                    "value": metafield.stepFive,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 5
                                                                {
                                                                    "id": metafield.whoWeAreID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "whoWeAre",
                                                                    "value": metafield.whoWeAre,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.whoInfoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "whoInfo",
                                                                    "value": metafield.whoInfo,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 6
                                                                {
                                                                    "id": metafield.reviewVideoOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewVideoOne",
                                                                    "value": metafield.reviewVideoOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewVideoTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewVideoTwo",
                                                                    "value": metafield.reviewVideoTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewVideoThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewVideoThree",
                                                                    "value": metafield.reviewVideoThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewScreenshotOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewScreenshotOne",
                                                                    "value": metafield.reviewScreenshotOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewScreenshotTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewScreenshotTwo",
                                                                    "value": metafield.reviewScreenshotTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewScreenshotThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewScreenshotThree",
                                                                    "value": metafield.reviewScreenshotThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewScreenshotFourID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewScreenshotFour",
                                                                    "value": metafield.reviewScreenshotFour,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewScreenshotFiveID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewScreenshotFive",
                                                                    "value": metafield.reviewScreenshotFive,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewOne",
                                                                    "value": metafield.reviewOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewTwo",
                                                                    "value": metafield.reviewTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewThree",
                                                                    "value": metafield.reviewThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewFourID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewFour",
                                                                    "value": metafield.reviewFour,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.reviewFiveID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "reviewFive",
                                                                    "value": metafield.reviewFive,
                                                                    "valueType": "STRING"
                                                                },
                                                                //section7

                                                                {
                                                                    "id": metafield.satisfactionID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "satisfaction",
                                                                    "value": metafield.satisfaction,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.satisfactionBodyID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "satisfactionBody",
                                                                    "value": metafield.satisfactionBody,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 8
                                                                {
                                                                    "id": metafield.questionOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "questionOne",
                                                                    "value": metafield.questionOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.answerOneID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "answerOne",
                                                                    "value": metafield.answerOne,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.questionTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "questionTwo",
                                                                    "value": metafield.questionTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.answerTwoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "answerTwo",
                                                                    "value": metafield.answerTwo,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.questionThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "questionThree",
                                                                    "value": metafield.questionThree,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.answerThreeID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "answerThree",
                                                                    "value": metafield.answerThree,
                                                                    "valueType": "STRING"
                                                                },

                                                                // section 9
                                                                {
                                                                    "id": metafield.specialDealID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "specialDeal",
                                                                    "value": metafield.specialDeal,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.specialDealImageID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "specialDealImage",
                                                                    "value": metafield.specialDealImage,
                                                                    "valueType": "STRING"
                                                                },
                                                                {
                                                                    "id": metafield.specialDealInfoID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "specialDealInfo",
                                                                    "value": metafield.specialDealInfo,
                                                                    "valueType": "STRING"
                                                                },

                                                                //section 10
                                                                {
                                                                    "id": metafield.variantID || null,
                                                                    'namespace': 'vizi',
                                                                    "key": "variant",
                                                                    "value": metafield.variant,
                                                                    "valueType": "STRING"
                                                                },


                                                            ]

                                                        };
                                                        console.log('PRODUCT META', productMetafield)
                                                        {
                                                            handleSubmit({
                                                                variables: { input: productMetafield },
                                                            })
                                                        };
                                                    }
                                                }
                                            ]}
                                        />
                                    </Form>
                                </Layout.Section>

                                {/* section two */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Two: As seen on TV (optional)</DisplayText>
                                        <DisplayText size="small">Has your product ever been featured by another business or influencer? This is a great way to create social proof about your brand. It builds a trust that you have a quality product because others have talked about you. If you don’t then you should reach out to blogs, influencers, or podcasts to promote your product. Then you can use their logo in the “As Seen On” section.
                                            Upload 3-5 Logos on businesses, influencers, podcasts, or blogs who’ve talked about your product.
                                    </DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>

                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    {/* <TextField
                                                        prefix=""
                                                        value={''}
                                                        onChange={handleChange('logo')}

                                                        label="What is a question you could ask someone?"
                                                        type="text"
                                                        helpText="Examples: Have dandruff? Feeling tired or sluggish? Sick Of Zits? Got Back Pain?"

                                                    /> */}
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>

                                {/* section three */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Three: Benefits of the product</DisplayText>
                                        <DisplayText size="small">People want to know the outcome of using your product. They want to know what’s in it for them! Although features are important, it's the benefits that sell the product. Benefits are the outcome of a product feature.  </DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    this is the image upload

                                                    {/* <TextField
                                                        prefix=""
                                                        value={''}
                                                        onChange={handleChange('f')}

                                                        label="What is a question you could ask someone?"
                                                        type="text"
                                                        helpText="Examples: Have dandruff? Feeling tired or sluggish? Sick Of Zits? Got Back Pain?"
                                                    /> */}
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.featureOne || ''}
                                                        onChange={handleChange('featureOne')}

                                                        label="Feature:"
                                                        type="text"
                                                        helpText="Example: High levels of L-Citrulline "
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.benefitOne || ''}
                                                        onChange={handleChange('benefitOne')}

                                                        label="Benefit:"
                                                        type="text"
                                                        helpText="Example: Get the maximum pump at the gym so you can continue to increase your size and tone!"
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    this is the image upload

                                                    {/* <TextField
                                                        prefix=""
                                                        value={''}
                                                        onChange={handleChange('f')}

                                                        label="What is a question you could ask someone?"
                                                        type="text"
                                                        helpText="Examples: Have dandruff? Feeling tired or sluggish? Sick Of Zits? Got Back Pain?"
                                                    /> */}
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.featureTwo || ''}
                                                        onChange={handleChange('featureTwo')}

                                                        label="Feature:"
                                                        type="text"
                                                        helpText="Example: Multiple Therapeutic Self-Heating Setting "
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.benefitTwo || ''}
                                                        onChange={handleChange('benefitTwo')}

                                                        label="Benefit:"
                                                        type="text"
                                                        helpText="Example: This allows you to find the perfect setting for increased circulation leading to faster recovery and reduction in pain."
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    this is the image upload

                                                    {/* <TextField
                                                        prefix=""
                                                        value={''}
                                                        onChange={handleChange('f')}

                                                        label="What is a question you could ask someone?"
                                                        type="text"
                                                        helpText="Examples: Have dandruff? Feeling tired or sluggish? Sick Of Zits? Got Back Pain?"
                                                    /> */}
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.featureThree || ''}
                                                        onChange={handleChange('featureThree')}

                                                        label="Feature:"
                                                        type="text"
                                                        helpText="Example: Only The Highest Quality! "
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.benefitThree || ''}
                                                        onChange={handleChange('benefitThree')}

                                                        label="Benefit:"
                                                        type="text"
                                                        helpText="Example: The Diamonds give the highest quality shine so you can be confident in your look."
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 4 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Four: How it works</DisplayText>
                                        <DisplayText size="small">If your product needs an explanation of the process to use it you want to detail that in 3-5 easy steps. </DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.stepOne || ''}
                                                        onChange={handleChange('stepOne')}

                                                        label="Step 1:"
                                                        type="text"
                                                        helpText="There needs to be a picture with this somehow but how do i format this better idk lol"
                                                    />

                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.stepTwo || ''}
                                                        onChange={handleChange('stepTwo')}

                                                        label="Step 2:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.stepThree || ''}
                                                        onChange={handleChange('stepThree')}
                                                        width='100vw'
                                                        label="Step 3:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.stepFour || ''}
                                                        onChange={handleChange('stepFour')}

                                                        label="Step 4:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.stepFive || ''}
                                                        onChange={handleChange('stepFive')}

                                                        label="Step 5:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>

                                {/* section 5 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Five: Who We Are</DisplayText>
                                        <DisplayText size="small">This is a good section to help connect with your visitor. The headline should be a simple statement of what you stand for.</DisplayText>

                                        <DisplayText size="small">The paragraph should be 3-5 sentences telling them about your story and why you started your business.</DisplayText>
                                        <DisplayText size="small">The image should be of you and your team or something that represents your brand. </DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.whoWeAre || ''}
                                                        onChange={handleChange('whoWeAre')}

                                                        label="Headline:"
                                                        type="text"
                                                        placeholder="Who We Are"
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.whoInfo || ''}
                                                        onChange={handleChange('whoInfo')}
                                                        multiline

                                                        label="Tell them about yourself:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 6 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Six: Reviews</DisplayText>
                                        <DisplayText size="small">Reviews are essential to building social proof about your products. There are 4 styles of reviews to use.</DisplayText>
                                    </TextContainer>

                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned title={`Do you have any video reviews hosted on YouTube? Enter three URLs below`}>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewVideoOne || ''}
                                                        onChange={handleChange('reviewVideoOne')}

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewVideoTwo || ''}
                                                        onChange={handleChange('reviewVideoTwo')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewVideoThree || ''}
                                                        onChange={handleChange('reviewVideoThree')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>



                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned title='Screenshots'>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewScreenshotOne || ''}
                                                        onChange={handleChange('reviewScreenshotOne')}

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewScreenshotTwo || ''}
                                                        onChange={handleChange('reviewScreenshotTwo')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewScreenshotThree || ''}
                                                        onChange={handleChange('reviewScreenshotThree')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewScreenshotFour || ''}
                                                        onChange={handleChange('reviewScreenshotFour')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewScreenshotFive || ''}
                                                        onChange={handleChange('reviewScreenshotFive')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>


                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>

                                <Layout.Section>
                                    <Form>
                                        <Card sectioned title='Do you have reviews people have emailed in to say to you or word of mouth reviews?'>
                                            <FormLayout>
                                                *Do not falsify reviews as it is illegal.
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewOne || ''}
                                                        onChange={handleChange('reviewOne')}
                                                        multiline
                                                        label=""
                                                        type="text"
                                                        helpText='Example: "I love this product! Can’t wait to reorder again!" -Bilbo Baggins'
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewTwo || ''}
                                                        onChange={handleChange('reviewTwo')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewThree || ''}
                                                        onChange={handleChange('reviewThree')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewFour || ''}
                                                        onChange={handleChange('reviewFour')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.reviewFive || ''}
                                                        onChange={handleChange('reviewFive')}
                                                        multiline

                                                        label=""
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 7 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Seven: Satisfaction Guarentee</DisplayText>
                                        <DisplayText size="small">Having a satisfaction Guarantee is a huge boost to increase your conversion rate. One of the biggest fears people have is if they buy a product and they don’t like it. This gives them the confidence that you stand behind your product and have provided a safety net for them.</DisplayText>
                                    </TextContainer>


                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.satisfaction || ''}
                                                        onChange={handleChange('satisfaction')}

                                                        label="Headline:"
                                                        type="text"
                                                        helpText="Examples: “We Stand By Our Products!” “30 Day Money Back Guarantee” "
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.satisfactionBody || ''}
                                                        onChange={handleChange('satisfactionBody')}
                                                        multiline

                                                        label="This is a chance to explain why you have a guarantee and how to use it"
                                                        type="text"
                                                        helpText="Example: 100% MONEY BACK GUARANTEE If you’re not happy, we’re not happy. We are confident you will love our [Insert Product Name]. If for any reason the product fails to meet your expectations, we offer a 100% money-back guarantee."
                                                    />
                                                </FormLayout.Group>


                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 8 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Eight: FAQ/Rebuttal</DisplayText>
                                        <DisplayText size="small">EVERYONE has questions and concerns before buying a product. Using a FAQ section can help with more specific concerns someone might have.</DisplayText>

                                        <DisplayText size="small">Online visitors have very little knowledge of your product. If you’re unsure what some FAQ would be, then ask friends and family who have no idea about your product what questions they would have if they were looking to buy it. </DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.questionOne || ''}
                                                        onChange={handleChange('questionOne')}

                                                        label="Question 1:"
                                                        type="text"
                                                        helpText=""
                                                    />

                                                    <TextField
                                                        prefix=""
                                                        value={metafield.answerOne || ''}
                                                        onChange={handleChange('answerOne')}
                                                        multiline

                                                        label="Answer 1:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.questionTwo || ''}
                                                        onChange={handleChange('questionTwo')}

                                                        label="Question 2:"
                                                        type="text"
                                                        helpText=""
                                                    />

                                                    <TextField
                                                        prefix=""
                                                        value={metafield.answerTwo || ''}
                                                        onChange={handleChange('answerTwo')}
                                                        multiline

                                                        label="Answer 2:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.questionThree || ''}
                                                        onChange={handleChange('questionThree')}

                                                        label="Question 3:"
                                                        type="text"
                                                        helpText=""
                                                    />



                                                    <TextField
                                                        prefix=""
                                                        value={metafield.answerThree || ''}
                                                        onChange={handleChange('answerThree')}
                                                        multiline

                                                        label="Answer 3:"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 9 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Nine: Bonus Special Deal</DisplayText>
                                        <DisplayText size="small">A great way to increase conversion rates is to offer a bonus product for Free. If you have a product that goes well with the main product here is a perfect place to tell them about it. </DisplayText>

                                        <DisplayText size="small">NOTE: If you’d like to use this section you will need to create a new product in Shopify that includes the bonus item or create an Automatic discount that will automatically add the bonus product to their order at check out.</DisplayText>

                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.specialDeal || ''}
                                                        onChange={handleChange('specialDeal')}

                                                        label="Headline:"
                                                        type="text"
                                                        helpText="Example: “Special Deal!” “Get [Name of Product] FREE with your purchase!”"
                                                        placeholder='Special Bonus!'
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.specialDealImage || ''}
                                                        onChange={handleChange('specialDealImage')}
                                                        multiline

                                                        label="Image"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.specialDealInfo || ''}
                                                        onChange={handleChange('specialDealInfo')}
                                                        multiline

                                                        label="Description"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>

                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                                {/* section 10 */}
                                <Layout.Section>
                                    <TextContainer>
                                        <DisplayText size='extraLarge'>Section Ten: Special Deal/Bundles/Variants</DisplayText>
                                        <DisplayText size="small">Here is where you will want to show different bundles or variants that your product has.</DisplayText>
                                    </TextContainer>
                                    {showError}
                                </Layout.Section>
                                <Layout.Section>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <TextField
                                                        prefix=""
                                                        value={metafield.variant || ''}
                                                        onChange={handleChange('variant')}
                                                        multiline

                                                        label="variant"
                                                        type="text"
                                                        helpText=""
                                                    />
                                                </FormLayout.Group>


                                                {/* <ChoiceList
                                                    title="Does your product have a variant"
                                                    choices={[

                                                        { label: 'Yes', value: 'minimum_purchase' },
                                                        {
                                                            label: 'No',
                                                            value: 'minimum_quantity',

                                                        },
                                                    ]}
                                                    selected={selected}
                                                    onChange={handleChoiceListChange}
                                                /> */}


                                            </FormLayout>

                                        </Card>
                                    </Form>
                                </Layout.Section>
                            </Layout>
                        </Page>
                    </Frame>
                );
            }}
        </Mutation >
    );
}

