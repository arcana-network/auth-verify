<script lang="ts" setup>
const stroke = 8
const radius = 20
const secondaryColor = '#8D8D8D'

const getViewBoxSize = (strokeWidth: number, radius: number) => {
  const startingPoint = -radius - strokeWidth / 2 + 1
  const endpoint = radius * 2 + strokeWidth
  return [startingPoint, startingPoint, endpoint, endpoint].join(' ')
}
const getPath = (radius: number) => {
  return ['M' + radius + ' 0c0-9.94-8.06', radius, radius, radius].join('-')
}
</script>

<template>
  <div aria-label="oval-loading">
    <svg
      width="80"
      height="80"
      :viewBox="getViewBoxSize(Number(stroke), radius)"
      xmlns="http://www.w3.org/2000/svg"
      className="xar-loader-circle"
      data-testid="oval-svg"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" :stroke-width="stroke" data-testid="oval-secondary-group">
          <circle
            strokeOpacity=".5"
            cx="0"
            cy="0"
            :r="radius"
            :stroke="secondaryColor"
            :stroke-width="stroke"
            opacity="0.3"
          />
          <path :d="getPath(radius)" class="xar-path">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  </div>
</template>


<style scoped>
.xar-loader-circle {
  stroke: var(--primary-color);
}
.xar-path {
  stroke: var(--primary-color);
}
</style>