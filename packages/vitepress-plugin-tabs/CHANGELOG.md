# vitepress-plugin-tabs

## 0.6.0

### Minor Changes

- [#50](https://github.com/sapphi-red/vitepress-plugins/pull/50) [`971574e`](https://github.com/sapphi-red/vitepress-plugins/commit/971574e5e63ab7838255a7f2ca224a7f09236e6f) Thanks [@kwesterfeld2](https://github.com/kwesterfeld2)! - render all tabs when printing

- [`3e3ecc3`](https://github.com/sapphi-red/vitepress-plugins/commit/3e3ecc306fd72d2f3640cc741a0abd9ca59e4ffd) Thanks [@sapphi-red](https://github.com/sapphi-red)! - update required vitepress version from 1.0.0-rc.27 to 1.0.0

## 0.5.0

### Minor Changes

- [#43](https://github.com/sapphi-red/vitepress-plugins/pull/43) [`381b01b`](https://github.com/sapphi-red/vitepress-plugins/commit/381b01bc4f4277bb14a26ea6d07ba94325d0b477) Thanks [@sapphi-red](https://github.com/sapphi-red)! - update required vitepress version from 1.0.0-rc.14 to 1.0.0-rc.27.

## 0.4.1

### Patch Changes

- [#40](https://github.com/sapphi-red/vitepress-plugins/pull/40) [`1669888`](https://github.com/sapphi-red/vitepress-plugins/commit/166988814c77e6e2b982bd40d848dfae4f5f0f32) Thanks [@sapphi-red](https://github.com/sapphi-red)! - fix hydration mismatch error when non default tab is selected.

- [#35](https://github.com/sapphi-red/vitepress-plugins/pull/35) [`b30ae90`](https://github.com/sapphi-red/vitepress-plugins/commit/b30ae9011a83cc76248c29ff2154240a4db43a5b) Thanks [@brc-dd](https://github.com/brc-dd)! - Use `--vp-c-bg` in light mode for code blocks inside tabs to have slight difference between the backgrounds.
  Specify margin and border radius on code blocks inside tabs to prevent them from overflowing on smaller viewport widths.

## 0.4.0

### Minor Changes

- [#31](https://github.com/sapphi-red/vitepress-plugins/pull/31) [`0864eed`](https://github.com/sapphi-red/vitepress-plugins/commit/0864eed9f406374f16fef159513ec0b1760d8460) Thanks [@sapphi-red](https://github.com/sapphi-red)! - update required vitepress version from 1.0.0-beta.2 to 1.0.0-rc.14.

## 0.3.0

### Minor Changes

- [#20](https://github.com/sapphi-red/vitepress-plugins/pull/20) [`7f4c8fe`](https://github.com/sapphi-red/vitepress-plugins/commit/7f4c8fe683650f6e8b82addc92c187fe07801fd4) Thanks [@sapphi-red](https://github.com/sapphi-red)! - update required vitepress version from 1.0.0-alpha.29 to 1.0.0-alpha.46. update required vue version from 3.2.45 to 3.2.47.

- [#24](https://github.com/sapphi-red/vitepress-plugins/pull/24) [`2951127`](https://github.com/sapphi-red/vitepress-plugins/commit/2951127dd0d4ade93d3d684bc26838f58b9068b8) Thanks [@DreierF](https://github.com/DreierF)! - - Changed syntax for creating tabs

  - Check out the document for the new syntax
  - Tab titles can now contain special characters (e.g. spaces)
  - Custom blocks can now appear nested inside a tab

- [#26](https://github.com/sapphi-red/vitepress-plugins/pull/26) [`2237629`](https://github.com/sapphi-red/vitepress-plugins/commit/2237629bf48a9013dc9d7fed508819af959188c4) Thanks [@sapphi-red](https://github.com/sapphi-red)! - update required vitepress version from 1.0.0-alpha.46 to 1.0.0-beta.2. update required vue version from 3.2.47 to 3.3.4.

### Patch Changes

- [#27](https://github.com/sapphi-red/vitepress-plugins/pull/27) [`26f1d20`](https://github.com/sapphi-red/vitepress-plugins/commit/26f1d20301ccaee0b11ed5c87e8c06f7bf1d6901) Thanks [@sapphi-red](https://github.com/sapphi-red)! - wasn't working without `vite.optimizeDeps.exclude`

- [`0064d38`](https://github.com/sapphi-red/vitepress-plugins/commit/0064d386289bc07a5893240eae9e45b4c2d898d5) Thanks [@sapphi-red](https://github.com/sapphi-red)! - active tab marker was shown over the page header

- [#29](https://github.com/sapphi-red/vitepress-plugins/pull/29) [`8e6d74d`](https://github.com/sapphi-red/vitepress-plugins/commit/8e6d74d1fd466476ae29efbfee737d43bba4c39b) Thanks [@sapphi-red](https://github.com/sapphi-red)! - a vertical scrollbar was shown

## 0.2.0

### Minor Changes

- [#15](https://github.com/sapphi-red/vitepress-plugins/pull/15) [`5e902a8`](https://github.com/sapphi-red/vitepress-plugins/commit/5e902a8fba33c7cb8db2b6e079d9d89ebaab9943) Thanks [@sapphi-red](https://github.com/sapphi-red)! - use css variables so that theme authors can override it

- [#13](https://github.com/sapphi-red/vitepress-plugins/pull/13) [`b428eb1`](https://github.com/sapphi-red/vitepress-plugins/commit/b428eb159b1b80ab64f3421a16c8219c00c5e5b9) Thanks [@sapphi-red](https://github.com/sapphi-red)! - align design with code-group component

## 0.1.2

### Patch Changes

- [#9](https://github.com/sapphi-red/vitepress-plugins/pull/9) [`24cfb5e`](https://github.com/sapphi-red/vitepress-plugins/commit/24cfb5ee76bd0eceb7b70c36c144210e020e80bf) Thanks [@sapphi-red](https://github.com/sapphi-red)! - fix hydration mismatch

## 0.1.1

### Patch Changes

- [#8](https://github.com/sapphi-red/vitepress-plugins/pull/8) [`c88262d`](https://github.com/sapphi-red/vitepress-plugins/commit/c88262d835f5a77fdcd978492ee88df5f5557268) Thanks [@sapphi-red](https://github.com/sapphi-red)! - keep scroll position when switching tabs.
