import { useEffect, useState } from 'react'
import {
  createGraphQLClient,
  GraphQLProvider as RealGraphQlProvider,
} from '@hammerframework/web'

import { Auth0Provider, useAuth0 } from './Auth0Provider'

export const GraphQLProvider = (props) => {
  const [client, setClient] = useState()
  const { isAuthenticated, getTokenSilently } = useAuth0()

  useEffect(() => {
    const fn = async () => {
      const token = await getTokenSilently()
      setClient(
        createGraphQLClient({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    }
    isAuthenticated && fn()
  }, [getTokenSilently, isAuthenticated])
  return <RealGraphQlProvider client={client} {...props} />
}

export const initAuth = (config) => {
  return {
    AuthProvider: (props) => <Auth0Provider config={config} {...props} />,
    useAuth: useAuth0,
    GraphQLProvider,
  }
}
