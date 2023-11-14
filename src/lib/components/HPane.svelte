<!-- horizontal pane -->
<div class={`h-full w-full flex flex-row overflow-hidden ${$$props.class || ''}`}>

  <!-- left -->
  {#if $$slots.left}
    <div class="h-full grow-0 shrink-0 overflow-hidden">
      <slot name="left" />
    </div>
  {/if}

  <div class="h-full grow shrink flex flex-col overflow-hidden">

    <!-- top -->
    {#if $$slots.top}
      <div class="grow-0 shrink-0 w-full overflow-hidden">
        <slot name="top" />
      </div>
    {/if}

    <!-- center -->
    <div class="grow shrink w-full overflow-hidden">
      <slot name="center" />
    </div>

    <!-- bottom -->
    {#if $$slots.bottom}
      <div class="grow-0 shrink-0 w-full overflow-hidden">
        <slot name="bottom" />
      </div>
    {/if}
      
  </div>

  <!-- right -->
  {#if $$slots.right}
    <div class="h-full grow-0 shrink-0 overflow-hidden">
      <slot name="right" />
    </div>
  {/if}

</div>