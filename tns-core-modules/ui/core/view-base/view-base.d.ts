/**
 * @module "ui/core/view-base"
 */ /** */

import { Property, InheritedProperty, Style } from "../properties";
import { BindingOptions, Observable } from "../bindable";

import { SelectorCore } from "../../styling/css-selector";
import { isIOS, isAndroid } from "../../../platform";

import { KeyframeAnimation } from "../../animation/keyframe-animation";
import { Page } from "../../page";
import { layout } from "../../../utils/utils";

import { Color } from "../../../color";
import { Order, FlexGrow, FlexShrink, FlexWrapBefore, AlignSelf } from "../../layouts/flexbox-layout";
import { Length } from "../../styling/style-properties";

export { isIOS, isAndroid, layout, Color };
export * from "../properties";
export * from "../bindable";

/**
 * Iterates through all child views (via visual tree) and executes a function.
 * @param view - Starting view (parent container).
 * @param callback - A function to execute on every child. If function returns false it breaks the iteration.
 */
export function eachDescendant(view: ViewBase, callback: (child: ViewBase) => boolean);

/**
 * Gets an ancestor from a given type.
 * @param view - Starting view (child view).
 * @param criterion - The type of ancestor view we are looking for. Could be a string containing a class name or an actual type.
 * Returns an instance of a view (if found), otherwise undefined.
 */
export function getAncestor(view: ViewBase, criterion: string | Function): ViewBase;

export function isEventOrGesture(name: string, view: ViewBase): boolean;

/**
 * Gets a child view by id.
 * @param view - The parent (container) view of the view to look for.
 * @param id - The id of the view to look for.
 * Returns an instance of a view (if found), otherwise undefined.
 */
export function getViewById(view: ViewBase, id: string): ViewBase;

export abstract class ViewBase extends Observable {
    // Dynamic properties.
    left: Length;
    top: Length;
    effectiveLeft: number;
    effectiveTop: number;
    dock: "left" | "top" | "right" | "bottom";
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;

    order: Order;
    flexGrow: FlexGrow;
    flexShrink: FlexShrink;
    flexWrapBefore: FlexWrapBefore;
    alignSelf: AlignSelf;

    //@private
    /**
     * @private
     */
    _oldLeft: number;
    /**
     * @private
     */
    _oldTop: number;
    /**
     * @private
     */
    _oldRight: number;
    /**
     * @private
     */
    _oldBottom: number;
    /**
     * @private
     */
    _defaultPaddingTop: number;
    /**
     * @private
     */
    _defaultPaddingRight: number;
    /**
     * @private
     */
    _defaultPaddingBottom: number;
    /**
     * @private
     */
    _defaultPaddingLeft: number;
    //@endprivate

    public effectiveMinWidth: number;
    public effectiveMinHeight: number;
    public effectiveWidth: number;
    public effectiveHeight: number;
    public effectiveMarginTop: number;
    public effectiveMarginRight: number;
    public effectiveMarginBottom: number;
    public effectiveMarginLeft: number;
    public effectivePaddingTop: number;
    public effectivePaddingRight: number;
    public effectivePaddingBottom: number;
    public effectivePaddingLeft: number;
    public effectiveBorderTopWidth: number;
    public effectiveBorderRightWidth: number;
    public effectiveBorderBottomWidth: number;
    public effectiveBorderLeftWidth: number;

    /**
     * String value used when hooking to loaded event.
     */
    public static loadedEvent: string;

    /**
     * String value used when hooking to unloaded event.
     */
    public static unloadedEvent: string;

    public ios: any;
    public android: any;
    public nativeView: any;
    public bindingContext: any;
    public recycleNativeView: boolean;

    /**
     * Gets the name of the constructor function for this instance. E.g. for a Button class this will return "Button".
     */
    public typeName: string;

    /**
     * Gets the parent view. This property is read-only.
     */
    public readonly parent: ViewBase;

    /**
     * Gets or sets the id for this view.
     */
    public id: string;

    /**
     * Gets or sets the CSS class name for this view.
     */
    public className: string;

    /**
     * Gets or sets inline style selectors for this view.   
     */
    public inlineStyleSelector: SelectorCore;

    /**
     * Gets owner page. This is a read-only property.
     */
    public readonly page: Page;

    /**
     * Gets the style object associated to this view.
     */
    public readonly style: Style;

    /**
     * Returns true if visibility is set to 'collapse'.
     * Readonly property
     */
    public isCollapsed: boolean;
    public readonly isLoaded: boolean;

    /**
     * Returns the child view with the specified id.
     */
    public getViewById<T extends ViewBase>(id: string): T;

    public onLoaded(): void;
    public onUnloaded(): void;

    public bind(options: BindingOptions, source?: Object): void;
    public unbind(property: string): void;

    public requestLayout(): void;
    public eachChild(callback: (child: ViewBase) => boolean): void;

    public _addView(view: ViewBase, atIndex?: number): void;
    /**
     * Method is intended to be overridden by inheritors and used as "protected"
     */
    public _addViewCore(view: ViewBase, atIndex?: number): void;

    public _removeView(view: ViewBase): void;
    /**
     * Method is intended to be overridden by inheritors and used as "protected"
     */
    public _removeViewCore(view: ViewBase): void;
    public _parentChanged(oldParent: ViewBase): void;

    _domId: number;

    _cssState: any /* "ui/styling/style-scope" */;
    _setCssState(next: any /* "ui/styling/style-scope" */);
    _registerAnimation(animation: KeyframeAnimation);
    _unregisterAnimation(animation: KeyframeAnimation);
    _cancelAllAnimations();

    public cssClasses: Set<string>;
    public cssPseudoClasses: Set<string>;

    public _goToVisualState(state: string): void;
    public _applyXmlAttribute(attribute, value): boolean;
    public setInlineStyle(style: string): void;

    _context: any /* android.content.Context */;

    /** 
     * Setups the UI for ViewBase and all its children recursively.
     * This method should *not* be overridden by derived views.
     */
    _setupUI(context: any /* android.content.Context */, atIndex?: number): void;

    /**
     * Tears down the UI for ViewBase and all its children recursively.
     * This method should *not* be overridden by derived views.
     */
    _tearDownUI(force?: boolean): void;

    /**
     * Creates a native view.
     * Returns either android.view.View or UIView.
     */
    createNativeView(): Object;

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void;

    /**
     * Clean up references to the native view.
     */
    disposeNativeView(): void;

    /**
     * Resets properties/listeners set to the native view.
     */
    resetNativeView(): void;

    _isAddedToNativeVisualTree: boolean;

    /**
     * Performs the core logic of adding a child view to the native visual tree. Returns true if the view's native representation has been successfully added, false otherwise.
     */
    _addViewToNativeVisualTree(view: ViewBase, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(view: ViewBase): void;
    _childIndexToNativeChildIndex(index?: number): number;

    /**
     * @protected
     * @unstable
     * A widget can call this method to add a matching css pseudo class.
     */
    public addPseudoClass(name: string): void;

    /**
     * @protected
     * @unstable
     * A widget can call this method to discard mathing css pseudo class.
     */
    public deletePseudoClass(name: string): void;

    //@private
    public _styleScope: any;

    /**
     * Determines the depth of batchUpdates.
     * When the value is 0 the current updates are not batched.
     * If the value is 1 or greater, the current updates are batched.
     * Do not set this field, the _batchUpdate method is responsible to keep the count up to date.
     */
    public _batchUpdateScope: number;

    /**
     * Allow multiple updates to be performed on the instance at once.
     */
    public _batchUpdate<T>(callback: () => T): T;
    //@endprivate
}

export const idProperty: Property<ViewBase, string>;
export const classNameProperty: Property<ViewBase, string>;
export const bindingContextProperty: InheritedProperty<ViewBase, any>;

/**
 * Converts string into boolean value.
 * Throws error if value is not 'true' or 'false'.
 */
export function booleanConverter(v: string): boolean;
