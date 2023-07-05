import updatePreferences from '@/frontend-api/user/updatePreferences';
import {Header} from '@/pages/profile';
import {useMutation} from '@tanstack/react-query';
import {DateTime} from 'luxon';
import {SyntheticEvent, useEffect, useState} from 'react';
import ButtonWithLoading from '../ButtonWithLoading';
import {
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Stack,
    Switch,
    Text
} from "@chakra-ui/react";
import {STATIC_METADATA_IMAGES} from "next/dist/lib/metadata/is-metadata-route";
import {useFormik} from "formik";
import * as yup from "yup";

export default function PreferencesSection({user: userFromProps}: any) {
    const user = userFromProps;
    const hasPreferences = user.hasOwnProperty('preferences') && user.preferences && (user.preferences as any).id;


    const initialValues = {
        account: hasPreferences ? !!user.preferences.account : true,
        top: hasPreferences ? !!user.preferences.top : true,
        current: hasPreferences ? !!user.preferences.current : true,
        recent: hasPreferences ? !!user.preferences.recent : true,
    }

    const {dirty, values, setFieldValue, isSubmitting, handleSubmit} = useFormik({
        initialValues,
        validationSchema: yup.object().shape({
            account: yup.boolean(),
            top: yup.boolean(),
            current: yup.boolean(),
            recent: yup.boolean(),
        }),
        onSubmit: handlePreferenceUpdate,

    })

    const {
        status: updateStatus,
        error: updateError,
        mutateAsync: updatePreferencesAsync,
    } = useMutation(
        ['updatePreference', user],
        async (obj: Preferences) => await updatePreferences(obj),
    );


    async function handlePreferenceUpdate(values: typeof initialValues) {
        await updatePreferencesAsync(values);
    }

    return (
        <>
            <Header
                title="Preferences"
                lead=""
            />

            <form onSubmit={handleSubmit}>
                <Stack gap={10}>

                    {updateStatus === 'success' && (
                        <Alert status='success'>
                            <AlertIcon/>
                            Preferences updated successfully!
                        </Alert>
                    )}

                    <FormControl>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Stack>
                                <FormLabel m={0}>
                                    Recently Played Songs
                                </FormLabel>

                                <FormHelperText m={0}>
                                    When enabled, your recently played songs are visible to other users.
                                </FormHelperText>
                            </Stack>

                            <Switch
                                isChecked={values.recent}
                                onChange={(e) => {
                                    setFieldValue('recent', e.target.checked)
                                }}
                            />
                        </HStack>
                    </FormControl>

                    <FormControl>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Stack>
                                <FormLabel m={0}>
                                    Top Songs
                                </FormLabel>

                                <FormHelperText m={0}>
                                    When enabled, your top songs are visible to other users.
                                </FormHelperText>
                            </Stack>

                            <Switch
                                isChecked={values.top}
                                onChange={(e) => {
                                    setFieldValue('top', e.target.checked)
                                }}
                            />
                        </HStack>
                    </FormControl>

                    <FormControl>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Stack>
                                <FormLabel m={0}>
                                    Currently Playing Track
                                </FormLabel>

                                <FormHelperText m={0}>
                                    When enabled, your currently playing track is visible to other users.
                                </FormHelperText>
                            </Stack>

                            <Switch
                                isChecked={values.current}
                                onChange={(e) => {
                                    setFieldValue('current', e.target.checked)
                                }}
                            />
                        </HStack>
                    </FormControl>

                    <FormControl>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <Stack>
                                <FormLabel m={0}>
                                    Account
                                </FormLabel>

                                <FormHelperText m={0}>
                                    When enabled, your profile is visible to other users.
                                </FormHelperText>
                            </Stack>

                            <Switch
                                isChecked={values.account}
                                onChange={(e) => {
                                    setFieldValue('account', e.target.checked)
                                }}
                            />
                        </HStack>
                    </FormControl>

                    {hasPreferences && (
                        <Text color={'gray.500'} fontSize={'sm'}>
                            Last updated:{' '}
                            {DateTime.fromISO(userFromProps.preferences.updated_at).toRelative()}
                        </Text>
                    )}

                    <Button
                        isDisabled={isSubmitting || !dirty}
                        isLoading={isSubmitting}
                        type={"submit"}
                    >
                        Update Preferences
                    </Button>

                </Stack>


            </form>


        </>
    );
}
