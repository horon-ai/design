import { useState } from "react"
import { SafeAreaView, ScrollView, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import * as Font from "expo-font"
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts,
} from "@expo-google-fonts/geist"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  Input,
  Spinner,
  Text,
  ThemeProvider,
  VStack,
  useTheme,
} from "@horon/app"

/**
 * A minimal screen that renders @horon/app components under the app theme.
 * Every control here is imported from @horon/app - nothing is reimplemented.
 */
function Screen() {
  const t = useTheme()
  const [email, setEmail] = useState("")

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.space[6], gap: t.space[6] }}
      >
        <VStack gap={2}>
          <HStack gap={2} align="center">
            <Text variant="title">Horon Native</Text>
            <Badge variant="secondary">Expo</Badge>
          </HStack>
          <Text variant="bodySm" tone="muted">
            @horon/app components rendered on iOS through the app theme.
          </Text>
        </VStack>

        <Card>
          <CardHeader>
            <HStack gap={2} align="center">
              <CardTitle>Sign in</CardTitle>
              <Badge>New</Badge>
            </HStack>
            <CardDescription>
              Every control below comes from @horon/app; none is reimplemented
              here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <HStack gap={2} align="center" wrap>
              <Button label="Continue" onPress={() => {}} />
              <Button variant="outline" label="Cancel" onPress={() => {}} />
              <Button variant="ghost" label="Skip" />
            </HStack>
            <HStack gap={2} align="center">
              <Spinner />
              <Text variant="bodySm" tone="muted">
                Working...
              </Text>
            </HStack>
            <HStack gap={2} wrap>
              <Badge>default</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="destructive">danger</Badge>
            </HStack>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary" label="Details" />
            <Button size="sm" variant="link" label="Learn more" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Font check</CardTitle>
            <CardDescription>
              fontFamily.native.sans must resolve to a loaded face at runtime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ fontFamily: t.fontFamily.native.sans }}>
              Geist renders this line ({t.fontFamily.native.sans}).
            </Text>
            <Text variant="bodySm" tone="muted">
              Font.isLoaded(&quot;Geist&quot;) ={" "}
              {String(Font.isLoaded("Geist"))}
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Geist: Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  })

  return (
    <ThemeProvider scheme="light">
      <StatusBar style="dark" />
      {fontsLoaded || fontError ? (
        <Screen />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Spinner />
        </View>
      )}
    </ThemeProvider>
  )
}
