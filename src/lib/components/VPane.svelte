<!-- vertical pane -->
<div class={`h-full w-full flex flex-col overflow-hidden ${$$props.class || ''}`}>

  <!-- top -->
  {#if $$slots.top}
    <div class="grow-0 shrink-0 w-full overflow-hidden">
      <slot name="top" />
    </div>
  {/if}

  <div class="grow shrink w-full flex flex-row overflow-hidden">

    <!-- left -->
    {#if $$slots.left}
      <div class="h-full grow-0 shrink-0 overflow-hidden">
        <slot name="left" />
      </div>
    {/if}

    <!-- center -->
    <div class="h-full grow shrink overflow-hidden">
      <slot name="center" />
    </div>

    <!-- right -->
    {#if $$slots.right}
      <div class="h-full grow-0 shrink-0 overflow-hidden">
        <slot name="right" />
      </div>
    {/if}

  </div>

  <!-- bottom -->
  {#if $$slots.bottom}
    <div class="grow-0 shrink-0 w-full overflow-hidden">
      <slot name="bottom" />
    </div>
  {/if}

</div>
