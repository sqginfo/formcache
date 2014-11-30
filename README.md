# [Form Cache](https://github.com/fengyuanchen/formcache)

A simple jQuery form cache plugin.


# Main

```
dist/
├── dist/formcache.js      (9 KB)
└── dist/formcache.min.js  (4 KB)
```


# Getting started

## Quick start

Three quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/formcache/archive/master.zip).
- Clone the repository: `git clone https://github.com/fengyuanchen/formcache.git`.
- Install with [NPM](http://npmjs.org): `npm install formcache`.


## Installation

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<script src="/path/to/formcache.js"></script>
```


## Usage

### Initializes with `data-toggle="formcache"` attribute

```html
<form data-toggle="formcache"></form>
```

### Initializes with `$.fn.formcache` method

```html
<form id="form"></form>
```

```javascript
$("#form").formcache()
```


## Options

#### key

- Type: `String` | `Number`
- Default: `""`

A special identification for the form cache, must be different to other forms in the same page.

By default, the form's index in the document will be used as the `key`.


#### local

- Type: `Boolean`
- Default: `true`

Store cache in localStorage.


#### session

- Type: `Boolean`
- Default: `true`

Store cache in sessionStorage.


#### controls

- Type: `Array`
- Default:
```javascript
[
  "select",
  "textarea",
  "input"
]
```

A jQuery selectors array. Defines the form controls which need to be cached.



## Methods

#### getCache([index])

---

##### index:
- Type: `Number`
- Default: `0`

---

Get the default cache object or a special one.

**Examples:**

```
$().formcache("getCache")
$().formcache("getCache", 1)
```


#### getCaches()

Get all cache objects.

**Examples:**

```
$().formcache("getCaches")
```


#### setCache([index, ]data)

---

##### index

- Type: `Number`
- Default: `0`

##### data

- Type: `Object`

---

Override the default cache object or add a new one.

**Examples:**

```
$().formcache("setCache", {})
$().formcache("setCache", 1, {})
```


#### setCaches(data)

---

##### data

- Type: `Array`

---

Override the old caches with new caches.

**Examples:**

```
$().formcache("setCaches", [{}])
$().formcache("setCaches", [{}, {}])
```


#### removeCache([index])

---

##### index

- Type: `Number`
- Default: `0`

---

Remove the default cache object or a special one.

**Examples:**

```
$().formcache("removeCache")
$().formcache("removeCache", 1)
```


#### removeCaches()

Remove all cache objects.

**Examples:**

```
$().formcache("removeCaches")
```


#### outputCache([index])

---

##### index

- Type: `Number`
- Default: `0`

---

Output the default cache object or a special one to the form.

The outputed cache object will be updated automatically when any form control changed.

**Examples:**

```
$().formcache("outputCache")
$().formcache("outputCache", 1)
```


#### store()

Store all caches to sessionStorage or localStorage.

The plugin will do this automatically when a form control changed, or the window unloaded.


#### clear()

Clear all caches.


#### destroy()

Destroy the formcache instance, but keep the caches.

If you want to remove all caches, you can call `clear` method first and then call the `destroy` method.


## [License](https://github.com/fengyuanchen/formcache/blob/master/LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.
