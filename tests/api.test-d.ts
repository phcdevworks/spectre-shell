import { expectTypeOf } from 'vitest'
import {
  bootstrapApp, bootReady,
  type BootstrapOptions, type ShellPlugin, type ShellPluginContext, type Router,
  type PrefetchStrategy
} from '../dist/index.js'
import type { RouterOptions, Route } from '@phcdevworks/spectre-shell-router'
import type { Signal } from '@phcdevworks/spectre-shell-signals'

expectTypeOf(bootstrapApp).parameters.toEqualTypeOf<[BootstrapOptions]>()
expectTypeOf(bootstrapApp).returns.toEqualTypeOf<Router>()
expectTypeOf(bootReady).toEqualTypeOf<Signal<boolean>>()
expectTypeOf<BootstrapOptions['root']>().toEqualTypeOf<HTMLElement>()
expectTypeOf<BootstrapOptions['routes']>().toEqualTypeOf<() => Route[]>()
expectTypeOf<BootstrapOptions['routerOptions']>().toEqualTypeOf<RouterOptions | undefined>()
expectTypeOf<ShellPlugin['install']>().toEqualTypeOf<(context: ShellPluginContext) => void>()
expectTypeOf<ShellPluginContext['bootReady']>().toEqualTypeOf<Signal<boolean>>()
expectTypeOf<PrefetchStrategy>().toEqualTypeOf<'intent' | 'viewport'>()
expectTypeOf<BootstrapOptions['prefetch']>().toEqualTypeOf<PrefetchStrategy | false | undefined>()
expectTypeOf<ShellPlugin['defer']>().toEqualTypeOf<boolean | undefined>()
